import { getInviteByToken } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import InviteForm from "./invite-form";

export async function generateMetadata(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  const invite = await getInviteByToken(params.token);
  if (invite == null) return notFound();

  return {
    title: `Hi ${invite.name}!`,
    description: `Invitation to ${invite.event.name}, on the ${invite.event.date}. Click the link to accept or decline.`,
  };
}

export default async function Invite(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  const invite = await getInviteByToken(params.token);
  if (invite == null) return notFound();

  return <InviteForm invite={invite} event={invite.event} />;
}
