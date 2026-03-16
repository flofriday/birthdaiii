import { getAdminSecret } from "@/lib/config";
import { getAllEvents, createEvent } from "@/lib/invite-service";

export async function GET(
  _request: Request,
  props: { params: Promise<{ secret: string }> }
) {
  const params = await props.params;
  if (params.secret !== (await getAdminSecret())) {
    return Response.json({ errorMessage: "You are not the admin!" }, { status: 403 });
  }
  return Response.json(await getAllEvents());
}

export async function POST(
  request: Request,
  props: { params: Promise<{ secret: string }> }
) {
  const params = await props.params;
  if (params.secret !== (await getAdminSecret())) {
    return Response.json({ errorMessage: "You are not the admin!" }, { status: 403 });
  }

  const body = await request.json();
  if (!body.name || !body.location || !body.date) {
    return Response.json(
      { errorMessage: "Name, location and date are required" },
      { status: 400 }
    );
  }

  return Response.json(
    await createEvent({
      name: body.name,
      location: body.location,
      date: body.date,
      groupChat: body.groupChat ?? "",
    })
  );
}
