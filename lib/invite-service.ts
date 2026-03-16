import prisma from "../lib/prisma";
import { Invite, Event } from "@prisma/client";
import { AcceptState } from "./accept-state";
import * as crypto from "crypto";

function generateInviteToken(length: number): string {
  const randomBytes = crypto.randomBytes(length);
  const base64 = randomBytes.toString("base64");
  const base64Url = base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64Url.substring(0, length);
}

// Events

export async function getAllEvents(): Promise<Event[]> {
  return await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getEventById(id: number): Promise<Event | null> {
  return await prisma.event.findUnique({ where: { id } });
}

export async function createEvent(data: {
  name: string;
  location: string;
  date: string;
  groupChat: string;
}): Promise<Event> {
  return await prisma.event.create({ data });
}

export async function updateEvent(
  id: number,
  data: Partial<{ name: string; location: string; date: string; groupChat: string }>
): Promise<Event> {
  return await prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({ where: { id } });
}

// Invites

export async function getInvitesByEvent(eventId: number): Promise<Invite[]> {
  return await prisma.invite.findMany({ where: { eventId } });
}

export async function getInviteByToken(
  token: string
): Promise<(Invite & { event: Event }) | null> {
  return await prisma.invite.findFirst({
    where: { token },
    include: { event: true },
  });
}

export async function createInvite(
  name: string,
  fullName: string,
  eventId: number
): Promise<Invite> {
  const token = generateInviteToken(6);
  return await prisma.invite.create({
    data: {
      name,
      fullName,
      token,
      accepted: AcceptState.Pending,
      plusOne: 0,
      eventId,
    },
  });
}

export async function updateInvite(invite: Invite & { event?: unknown }): Promise<Invite> {
  const { id, createdAt, event, ...data } = invite;
  return await prisma.invite.update({
    where: { token: invite.token },
    data,
  });
}

export async function deleteInvite(token: string) {
  await prisma.invite.delete({ where: { token } });
}
