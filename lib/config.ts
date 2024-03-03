import { readFile } from 'fs/promises';

export type EventDetails = {location: string, date: string}

export async function getEventDetails(): Promise<EventDetails> {
    let config =  JSON.parse(await readFile("./birthdaiii.json", "utf-8"))
    return {location: config.location, date: config.date}
}

export async function getAdminSecret(): Promise<string> {
    let config =  JSON.parse(await readFile("./birthdaiii.json", "utf-8"))
    return config.adminSecret
}