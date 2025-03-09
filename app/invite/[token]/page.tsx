import { getInviteByToken } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import InviteForm from "./invite-form";
import { getEventDetails } from "@/lib/config";

export async function generateMetadata(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  let invite = await getInviteByToken(params.token);
  if (invite == null) {
    return notFound();
  }

  let eventDetails = await getEventDetails();

  return {
    title: `Hi ${invite.name}!`,
    description: `Invitation to my ${eventDetails.name}, on the ${eventDetails.date}. Click the link to accept or decline.`,
  };
}

export default async function Invite(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;

  let invite = await getInviteByToken(params.token);
  if (invite == null) {
    return notFound();
  }

  let eventDetails = await getEventDetails();

  return <InviteForm invite={invite} event={eventDetails}></InviteForm>;
}
