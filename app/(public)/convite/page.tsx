import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessCookie } from "@/lib/auth/access-cookie";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ACCESS_COOKIE_NAME, WEDDING } from "@/lib/constants";
import InvitationExperience from "@/components/public/InvitationExperience";
import CloudReveal from "@/components/public/CloudReveal";
import HeroInvite from "@/components/public/HeroInvite";
import WelcomeSection from "@/components/public/WelcomeSection";
import WeddingDetails from "@/components/public/WeddingDetails";
import StorySection from "@/components/public/StorySection";
import ScheduleSection from "@/components/public/ScheduleSection";
import UsefulInfo from "@/components/public/UsefulInfo";
import RSVPForm, { type ExistingRsvp, type RSVPGuest } from "@/components/public/RSVPForm";
import GiftsSection, { type Gift } from "@/components/public/GiftsSection";
import PrivateMessageSection from "@/components/public/PrivateMessageSection";
import Footer from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default async function ConvitePage() {
  const cookieStore = await cookies();
  const payload = await verifyAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!payload) {
    redirect("/?erro=acesso");
  }

  const supabase = createSupabaseAdminClient();

  const [householdResult, guestsResult, rsvpResult, giftsResult] = await Promise.all([
    supabase.from("households").select("id, display_name").eq("id", payload.householdId).single(),
    supabase
      .from("guests")
      .select("id, full_name, age_group")
      .eq("household_id", payload.householdId)
      .eq("is_invited", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("rsvp_submissions")
      .select("status, dietary_restrictions, message")
      .eq("household_id", payload.householdId)
      .maybeSingle(),
    supabase
      .from("gifts")
      .select("id, title, description, suggested_amount_cents, allow_custom_amount")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (!householdResult.data) {
    redirect("/?erro=acesso");
  }

  const guests: RSVPGuest[] = (guestsResult.data ?? []).map((guest) => ({
    id: guest.id,
    fullName: guest.full_name,
    ageGroup: guest.age_group,
  }));

  const existingSubmission: ExistingRsvp | null = rsvpResult.data
    ? {
        status: rsvpResult.data.status,
        dietaryRestrictions: rsvpResult.data.dietary_restrictions,
        message: rsvpResult.data.message,
      }
    : null;

  const gifts: Gift[] = (giftsResult.data ?? []).map((gift) => ({
    id: gift.id,
    title: gift.title,
    description: gift.description,
    suggestedAmountCents: gift.suggested_amount_cents,
    allowCustomAmount: gift.allow_custom_amount,
  }));

  // This route is already forced dynamic (cookies() above) and re-runs per
  // request, so a fresh Date.now() here is exactly what we want, not a
  // memoization hazard.
  // eslint-disable-next-line react-hooks/purity
  const deadlinePassed = Date.now() > new Date(WEDDING.rsvpDeadlineISO).getTime();

  return (
    <InvitationExperience>
      <CloudReveal />
      <HeroInvite />
      <WelcomeSection />
      <WeddingDetails />
      <StorySection />
      <ScheduleSection />
      <UsefulInfo />
      <RSVPForm
        householdName={householdResult.data.display_name}
        guests={guests}
        existingSubmission={existingSubmission}
        deadlinePassed={deadlinePassed}
      />
      <GiftsSection gifts={gifts} />
      <PrivateMessageSection />
      <Footer />
    </InvitationExperience>
  );
}
