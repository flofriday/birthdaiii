import { readFile } from "fs/promises";

export type EventDetails = {
  name: string;
  location: string;
  date: string;
  groupChat: string;
};

export async function getEventDetails(): Promise<EventDetails> {
  let config = JSON.parse(await readFile("./birthdaiii.json", "utf-8"));
  return {
    name: config.name,
    location: config.location,
    date: config.date,
    groupChat: config.groupChat,
  };
}

export async function getAdminSecret(): Promise<string> {
  let config = JSON.parse(await readFile("./birthdaiii.json", "utf-8"));
  return config.adminSecret;
}
