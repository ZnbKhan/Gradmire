/**
 * The application journey, in order. Kept in one place because the portal
 * timeline, the admin stage picker and the progress meter all render it.
 */
export const STAGES = [
  { key: "enquiry", label: "Enquiry received", blurb: "We have your details and a counselor is assigned." },
  { key: "shortlisting", label: "Shortlisting", blurb: "Building your course and university shortlist." },
  { key: "documents_pending", label: "Documents pending", blurb: "Waiting on transcripts, SOP or references." },
  { key: "submitted", label: "Application submitted", blurb: "Sent to the university. Now we wait." },
  { key: "offer_received", label: "Offer received", blurb: "The university has made you an offer." },
  { key: "offer_accepted", label: "Offer accepted", blurb: "You've firmed your place and paid the deposit." },
  { key: "cas_issued", label: "CAS issued", blurb: "Your Confirmation of Acceptance for Studies is through." },
  { key: "visa_applied", label: "Visa applied", blurb: "Student visa application submitted." },
  { key: "visa_approved", label: "Visa approved", blurb: "You're cleared to travel." },
  { key: "enrolled", label: "Enrolled", blurb: "Registered at your university. Done." },
] as const;

export type StageKey = (typeof STAGES)[number]["key"] | "withdrawn";

export function stageIndex(stage: string) {
  return STAGES.findIndex((s) => s.key === stage);
}

export function stageLabel(stage: string) {
  if (stage === "withdrawn") return "Withdrawn";
  return STAGES.find((s) => s.key === stage)?.label ?? stage;
}
