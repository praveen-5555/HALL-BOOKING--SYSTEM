import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function readDb() {
  const file = await fs.readFile(dbPath, "utf8");
  return JSON.parse(file);
}

export async function writeDb(data: unknown) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8");
}
