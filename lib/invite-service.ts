import prisma from "../lib/prisma";
import { Invite } from "@prisma/client";
import { AcceptState } from "./accept-state";
import { randomUUID } from "crypto";

import * as crypto from "crypto";

function generateInviteToken(length: number): string {
  // Create 6 random bytes (will produce ~8 base64 characters)
  const randomBytes = crypto.randomBytes(length);

  // Convert to base64
  const base64 = randomBytes.toString("base64");

  // Convert to base64Url by replacing characters
  const base64Url = base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Trim to desired length
  return base64Url.substring(0, length);
}

export async function getAllInvites(): Promise<Invite[]> {
  return await prisma.invite.findMany();
}

export async function getInviteByToken(token: string): Promise<Invite | null> {
  return await prisma.invite.findFirst({
    where: { token: token },
  });
}

export async function createInvite(
  name: string,
  fullName: string,
): Promise<Invite> {
  let token = generateInviteToken(4);
  return await prisma.invite.create({
    data: {
      name: name,
      fullName: fullName,
      token: token,
      accepted: AcceptState.Pending,
      plusOne: 0,
    },
  });
}

export async function updateInvite(invite: Invite): Promise<Invite> {
  return await prisma.invite.update({
    where: { token: invite.token },
    data: invite,
  });
}

export async function deleteInvite(token: string) {
  await prisma.invite.delete({ where: { token: token } });
}
