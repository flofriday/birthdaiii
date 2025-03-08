import { getAdminSecret } from "@/lib/config";
import { createInvite, getAllInvites } from "@/lib/invite-service";

export async function GET(request: Request, props: {params: Promise<{secret: string}>}) {
    const params = await props.params;

    if (params.secret != (await getAdminSecret())) {
        return Response.json({errorMessage: "You are not the admin!"}, {status: 403})
    }

    return Response.json(await getAllInvites())
}

export async function POST(request: Request, props: {params: Promise<{secret: string}>}) {
    const params = await props.params;

    if (params.secret != (await getAdminSecret())) {
        return Response.json({errorMessage: "You are not the admin!"}, {status: 403})
    }

    let newInvite: {name: string, fullName: string} = await request.json()
    if (newInvite.fullName == "" || newInvite.name == "") { 
        return Response.json({errorMessage: "The name and full name must not be empty"}, {status: 403})
    }

    return Response.json(await createInvite(newInvite.name, newInvite.fullName))
}