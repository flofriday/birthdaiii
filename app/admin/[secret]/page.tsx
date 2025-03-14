import { getAdminSecret, getEventDetails } from "@/lib/config";
import { getAllInvites } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import Dashboard from "./dashboard";

export default async function Admin(props: {
  params: Promise<{ secret: string }>;
}) {
  const params = await props.params;

  if (params.secret != (await getAdminSecret())) {
    return notFound();
  }

  let eventDetails = await getEventDetails();
  let invites = await getAllInvites();

  return (
    <Dashboard
      invites={invites}
      event={eventDetails}
      adminSecret={params.secret}
    ></Dashboard>
  );
}
