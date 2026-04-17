import { readDb, writeDb } from "../../../lib/db";
import { User } from "../../../lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const db = await readDb();
  const users = db.users || [];

  if (email) {
    return Response.json(users.filter((user: User) => user.email === email));
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

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get ID from URL path

  if (!id) {
    return Response.json({ error: "User ID required" }, { status: 400 });
  }

  const body = await request.json();
  const db = await readDb();
  const users = db.users || [];
  const userIndex = users.findIndex((user: User) => user.id === id);

  if (userIndex === -1) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const updatedUser = { ...users[userIndex], ...body };
  db.users[userIndex] = updatedUser;
  await writeDb(db);

  return Response.json(updatedUser);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get ID from URL path

  if (!id) {
    return Response.json({ error: "User ID required" }, { status: 400 });
  }

  const db = await readDb();
  const users = db.users || [];
  const userIndex = users.findIndex((user: User) => user.id === id);

  if (userIndex === -1) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  db.users = users.filter((user: User) => user.id !== id);
  await writeDb(db);

  return Response.json({ success: true });
}
