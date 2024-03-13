import { getAdminSecret } from "@/lib/config";
import { deleteInvite } from "@/lib/invite-service";

export async function DELETE(
  request: Request,
  { params }: { params: { secret: string; token: string } }
) {
  if (params.secret != (await getAdminSecret())) {
    return Response.json(
      { errorMessage: "You are not the admin!" },
      { status: 403 }
    );
  }

  await deleteInvite(params.token);
  return Response.json({});
}
