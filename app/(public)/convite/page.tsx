import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessCookie } from "@/lib/auth/access-cookie";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ACCESS_COOKIE_NAME, PUBLIC_EXPERIENCE, WEDDING } from "@/lib/constants";
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
import GallerySection from "@/components/public/GallerySection";
import LodgingSection from "@/components/public/LodgingSection";

export const dynamic = "force-dynamic";

type SupabaseAdminClient = ReturnType<typeof createSupabaseAdminClient>;

/** Household data for the RSVP form, or null when the household is gone. */
async function loadRsvp(supabase: SupabaseAdminClient, householdId: string) {
  const [householdResult, guestsResult, rsvpResult] = await Promise.all([
    supabase.from("households").select("id, display_name").eq("id", householdId).single(),
    supabase
      .from("guests")
      .select("id, full_name, age_group")
      .eq("household_id", householdId)
      .eq("is_invited", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("rsvp_submissions")
      .select("status, dietary_restrictions, message")
      .eq("household_id", householdId)
      .maybeSingle(),
  ]);

  if (!householdResult.data) {
    return null;
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

  return {
    householdName: householdResult.data.display_name,
    guests,
    existingSubmission,
    // Runs per request (the page is forced dynamic), so a fresh Date.now()
    // here is exactly what we want.
    deadlinePassed: Date.now() > new Date(WEDDING.rsvpDeadlineISO).getTime(),
  };
}

export default async function ConvitePage() {
  const cookieStore = await cookies();
  const payload = await verifyAccessCookie(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (PUBLIC_EXPERIENCE.requireAccessCode && !payload) {
    redirect("/?erro=acesso");
  }

  const supabase = createSupabaseAdminClient();

  const [giftsResult, rsvp] = await Promise.all([
    supabase
      .from("gifts")
      .select("id, title, description, suggested_amount_cents, allow_custom_amount, gift_type, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    PUBLIC_EXPERIENCE.showRsvp && payload ? loadRsvp(supabase, payload.householdId) : null,
  ]);

  if (PUBLIC_EXPERIENCE.requireAccessCode && PUBLIC_EXPERIENCE.showRsvp && !rsvp) {
    redirect("/?erro=acesso");
  }

  const gifts: Gift[] = (giftsResult.data ?? []).map((gift) => ({
    id: gift.id,
    title: gift.title,
    description: gift.description,
    suggestedAmountCents: gift.suggested_amount_cents,
    allowCustomAmount: gift.allow_custom_amount,
    giftType: gift.gift_type === "free" ? "free" : "suggested",
    sortOrder: gift.sort_order,
  }));

  return (
    <InvitationExperience>
      <CloudReveal />
      <HeroInvite />
      <WelcomeSection />
      <WeddingDetails />
      <StorySection />
      <ScheduleSection />
      <UsefulInfo />
      <LodgingSection />
      <GiftsSection gifts={gifts} />
      <GallerySection />
      {rsvp && <RSVPForm {...rsvp} />}
      <PrivateMessageSection />
      <Footer />
    </InvitationExperience>
  );
}
