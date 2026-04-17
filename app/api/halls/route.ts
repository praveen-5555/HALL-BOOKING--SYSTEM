import { readDb, writeDb } from "../../../lib/db";
import { Hall } from "../../../lib/types";

export async function GET() {
  const db = await readDb();
  return Response.json(db.halls || []);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();
  const halls = db.halls || [];
  const newHall: Hall = { id: String(Date.now()), ...body };
  db.halls = [...halls, newHall];
  await writeDb(db);
  return Response.json(newHall);
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get ID from URL path

  if (!id) {
    return Response.json({ error: "Hall ID required" }, { status: 400 });
  }

  const body = await request.json();
  const db = await readDb();
  const halls = db.halls || [];
  const hallIndex = halls.findIndex((hall: Hall) => hall.id === id);

  if (hallIndex === -1) {
    return Response.json({ error: "Hall not found" }, { status: 404 });
  }

  const updatedHall = { ...halls[hallIndex], ...body };
  db.halls[hallIndex] = updatedHall;
  await writeDb(db);

  return Response.json(updatedHall);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get ID from URL path

  if (!id) {
    return Response.json({ error: "Hall ID required" }, { status: 400 });
  }

  const db = await readDb();
  const halls = db.halls || [];
  const hallIndex = halls.findIndex((hall: Hall) => hall.id === id);

  if (hallIndex === -1) {
    return Response.json({ error: "Hall not found" }, { status: 404 });
  }

  db.halls = halls.filter((hall: Hall) => hall.id !== id);
  await writeDb(db);

  return Response.json({ success: true });
}
