import { getAdminSecret } from "@/lib/config";
import { updateEvent, deleteEvent } from "@/lib/invite-service";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ secret: string; id: string }> }
) {
  const params = await props.params;
  if (params.secret !== (await getAdminSecret())) {
    return Response.json({ errorMessage: "You are not the admin!" }, { status: 403 });
  }

  const body = await request.json();
  return Response.json(await updateEvent(Number(params.id), body));
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ secret: string; id: string }> }
) {
  const params = await props.params;
  if (params.secret !== (await getAdminSecret())) {
    return Response.json({ errorMessage: "You are not the admin!" }, { status: 403 });
  }

  await deleteEvent(Number(params.id));
  return Response.json({});
}
