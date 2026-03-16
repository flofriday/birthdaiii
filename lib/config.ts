import { readFile } from "fs/promises";

export async function getAdminSecret(): Promise<string> {
  let config = JSON.parse(await readFile("./birthdaiii.json", "utf-8"));
  return config.adminSecret;
}
