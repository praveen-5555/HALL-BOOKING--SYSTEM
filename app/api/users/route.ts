import { readDb, writeDb } from "../../../lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const db = await readDb();
  const users = db.users || [];

  if (email) {
    return Response.json(users.filter((user: any) => user.email === email));
  }

  return Response.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();
  const users = db.users || [];
  const newUser = { id: String(Date.now()), ...body };
  db.users = [...users, newUser];
  await writeDb(db);
  return Response.json(newUser);
}
