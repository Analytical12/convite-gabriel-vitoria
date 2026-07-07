import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getAuthorizedAdminUser } from "@/lib/auth/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AGE_GROUP_LABELS, PAYMENT_STATUS_LABELS, RSVP_STATUS_LABELS } from "@/lib/constants";

export async function GET() {
  const user = await getAuthorizedAdminUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  const [householdsRes, guestsRes, rsvpRes, giftsRes, contributionsRes, messagesRes] = await Promise.all([
    supabase.from("households").select("code, display_name, type, max_invited, is_active"),
    supabase
      .from("guests")
      .select("full_name, age_group, is_invited, households(code, display_name)")
      .returns<
        Array<{
          full_name: string;
          age_group: string;
          is_invited: boolean;
          households: { code: string; display_name: string } | null;
        }>
      >(),
    supabase
      .from("rsvp_submissions")
      .select("status, dietary_restrictions, message, submitted_at, edited_by_admin, households(display_name)")
      .returns<
        Array<{
          status: string;
          dietary_restrictions: string | null;
          message: string | null;
          submitted_at: string;
          edited_by_admin: boolean;
          households: { display_name: string } | null;
        }>
      >(),
    supabase.from("gifts").select("title, suggested_amount_cents, allow_custom_amount, is_active"),
    supabase
      .from("gift_contributions")
      .select(
        "amount_cents, payment_status, giver_name, provider_payment_id, created_at, paid_at, gifts(title), households(display_name)"
      )
      .returns<
        Array<{
          amount_cents: number;
          payment_status: string;
          giver_name: string | null;
          provider_payment_id: string | null;
          created_at: string;
          paid_at: string | null;
          gifts: { title: string } | null;
          households: { display_name: string } | null;
        }>
      >(),
    supabase
      .from("private_messages")
      .select("author_name, message, created_at, households(display_name)")
      .returns<
        Array<{
          author_name: string | null;
          message: string;
          created_at: string;
          households: { display_name: string } | null;
        }>
      >(),
  ]);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Convite Gabriel & Vitória";
  workbook.created = new Date();

  const familias = workbook.addWorksheet("Familias");
  familias.columns = [
    { header: "Código", key: "code", width: 16 },
    { header: "Nome", key: "name", width: 28 },
    { header: "Tipo", key: "type", width: 12 },
    { header: "Máx. convidados", key: "max", width: 14 },
    { header: "Ativo", key: "active", width: 10 },
  ];
  for (const household of householdsRes.data ?? []) {
    familias.addRow({
      code: household.code,
      name: household.display_name,
      type: household.type === "family" ? "Família" : "Individual",
      max: household.max_invited,
      active: household.is_active ? "Sim" : "Não",
    });
  }

  const convidados = workbook.addWorksheet("Convidados");
  convidados.columns = [
    { header: "Nome", key: "name", width: 28 },
    { header: "Família", key: "household", width: 24 },
    { header: "Código", key: "code", width: 16 },
    { header: "Faixa etária", key: "ageGroup", width: 18 },
    { header: "Convidado", key: "invited", width: 12 },
  ];
  for (const guest of guestsRes.data ?? []) {
    convidados.addRow({
      name: guest.full_name,
      household: guest.households?.display_name ?? "",
      code: guest.households?.code ?? "",
      ageGroup: AGE_GROUP_LABELS[guest.age_group] ?? guest.age_group,
      invited: guest.is_invited ? "Sim" : "Não",
    });
  }

  const rsvp = workbook.addWorksheet("RSVP");
  rsvp.columns = [
    { header: "Família", key: "household", width: 24 },
    { header: "Status", key: "status", width: 14 },
    { header: "Enviado em", key: "submittedAt", width: 18 },
    { header: "Editado pelo admin", key: "editedByAdmin", width: 18 },
    { header: "Mensagem", key: "message", width: 40 },
  ];
  for (const submission of rsvpRes.data ?? []) {
    rsvp.addRow({
      household: submission.households?.display_name ?? "",
      status: RSVP_STATUS_LABELS[submission.status] ?? submission.status,
      submittedAt: new Date(submission.submitted_at).toLocaleString("pt-BR"),
      editedByAdmin: submission.edited_by_admin ? "Sim" : "Não",
      message: submission.message ?? "",
    });
  }

  const restricoes = workbook.addWorksheet("Restricoes");
  restricoes.columns = [
    { header: "Família", key: "household", width: 24 },
    { header: "Restrição alimentar", key: "dietary", width: 50 },
  ];
  for (const submission of rsvpRes.data ?? []) {
    if (submission.dietary_restrictions) {
      restricoes.addRow({
        household: submission.households?.display_name ?? "",
        dietary: submission.dietary_restrictions,
      });
    }
  }

  const presentes = workbook.addWorksheet("Presentes");
  presentes.columns = [
    { header: "Título", key: "title", width: 32 },
    { header: "Valor sugerido", key: "amount", width: 16 },
    { header: "Permite valor customizado", key: "custom", width: 22 },
    { header: "Ativo", key: "active", width: 10 },
  ];
  for (const gift of giftsRes.data ?? []) {
    presentes.addRow({
      title: gift.title,
      amount: gift.suggested_amount_cents / 100,
      custom: gift.allow_custom_amount ? "Sim" : "Não",
      active: gift.is_active ? "Sim" : "Não",
    });
  }

  const pagamentos = workbook.addWorksheet("Pagamentos");
  pagamentos.columns = [
    { header: "Presente", key: "gift", width: 28 },
    { header: "Família", key: "household", width: 24 },
    { header: "De", key: "giver", width: 20 },
    { header: "Valor", key: "amount", width: 14 },
    { header: "Status", key: "status", width: 16 },
    { header: "ID pagamento (MP)", key: "providerId", width: 20 },
    { header: "Criado em", key: "createdAt", width: 18 },
    { header: "Pago em", key: "paidAt", width: 18 },
  ];
  for (const contribution of contributionsRes.data ?? []) {
    pagamentos.addRow({
      gift: contribution.gifts?.title ?? "",
      household: contribution.households?.display_name ?? "",
      giver: contribution.giver_name ?? "",
      amount: contribution.amount_cents / 100,
      status: PAYMENT_STATUS_LABELS[contribution.payment_status] ?? contribution.payment_status,
      providerId: contribution.provider_payment_id ?? "",
      createdAt: new Date(contribution.created_at).toLocaleString("pt-BR"),
      paidAt: contribution.paid_at ? new Date(contribution.paid_at).toLocaleString("pt-BR") : "",
    });
  }

  const recados = workbook.addWorksheet("Recados");
  recados.columns = [
    { header: "Família", key: "household", width: 24 },
    { header: "Assinado por", key: "author", width: 20 },
    { header: "Mensagem", key: "message", width: 60 },
    { header: "Data", key: "createdAt", width: 18 },
  ];
  for (const message of messagesRes.data ?? []) {
    recados.addRow({
      household: message.households?.display_name ?? "",
      author: message.author_name ?? "",
      message: message.message,
      createdAt: new Date(message.created_at).toLocaleString("pt-BR"),
    });
  }

  for (const sheet of workbook.worksheets) {
    sheet.getRow(1).font = { bold: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="convite-gv-export-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
