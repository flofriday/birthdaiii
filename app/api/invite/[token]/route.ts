import { getInviteByToken, updateInvite } from "@/lib/invite-service";
import { Invite } from "@prisma/client";

export const dynamic = "force-dynamic"; // defaults to auto
export async function PATCH(
  request: Request,
  { params }: { params: { token: string } }
) {
  // Verify the user hasa token
  if (getInviteByToken(params.token) == null) {
    return Response.json({}, { status: 403 });
  }

  let newInvite: Invite = await request.json();
  if (newInvite.token != params.token) {
    return Response.json({}, { status: 400 });
  }

  if (newInvite.plusOne < 0) {
    return Response.json(
      {
        errorMessage:
          "I know you don't have many friends, but let's keep it positive.",
      },
      { status: 400 }
    );
  }
  if (newInvite.plusOne > 4) {
    return Response.json(
      {
        errorMessage: `Come on that's kinda rude to bring ${newInvite.plusOne} strangers to a party.`,
      },
      { status: 400 }
    );
  }

  let updatedInvite = await updateInvite(newInvite);
  return Response.json(updatedInvite);
}

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  return Response.json(params);
}
