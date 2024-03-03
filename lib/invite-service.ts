import prisma from '../lib/prisma';
import {Invite} from '@prisma/client'
import { AcceptState } from './accept-state';
import { randomUUID } from 'crypto';


export async function getAllInvites(): Promise<Invite[]> {
    return await prisma.invite.findMany()
}

export async function getInviteByToken(token: string): Promise<Invite | null>  {
    return await prisma.invite.findFirst({
        where: {token : token}
    })
}

export async function createInvite(name: string, fullName: string): Promise<Invite> {
    let token = randomUUID.toString()
    return await prisma.invite.create({data: {name: name, fullName: fullName, token: token, accepted: AcceptState.Pending, plusOne: 0}})
}

export async function updateInvite(invite: Invite): Promise<Invite> {
    return await prisma.invite.update({
        where: {token : invite.token},
        data: invite
    })
}



export async function deleteInvite(token: string) {
    await prisma.invite.delete({where: {token: token}})
}