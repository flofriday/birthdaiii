import { getInviteByToken } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import InviteForm from "./invite-form";
import { getEventDetails } from "@/lib/config";

export default async function Invite({ params }: { params: { token: string } }) {

    let invite = await getInviteByToken(params.token)
    if (invite == null) {
        return notFound()
    }

    let eventDetails = await getEventDetails()

    return (
        <InviteForm invite={invite} event={eventDetails}></InviteForm>
    );
}
