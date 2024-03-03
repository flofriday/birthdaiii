import { getInviteByToken } from "@/lib/invite-service";
import { notFound } from "next/navigation";
import InviteForm from "./invite-form";

export default async function Invite({ params }: { params: { token: string } }) {

    let invite = await getInviteByToken(params.token)
    if (invite == null) {
        return notFound()
    }


    return (
        <InviteForm invite={invite}></InviteForm>
    );
}
