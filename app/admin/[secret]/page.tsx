import { getAdminSecret } from "@/lib/config";
import { getAllEvents } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import Dashboard from "./dashboard";

export default async function Admin(props: {
  params: Promise<{ secret: string }>;
}) {
  const params = await props.params;

  if (params.secret !== (await getAdminSecret())) {
    return notFound();
  }

  const events = await getAllEvents();

  return <Dashboard events={events} adminSecret={params.secret} />;
}
