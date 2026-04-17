import { readDb, writeDb } from "../../../lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const db = await readDb();
  const bookings = db.bookings || [];

  if (userId) {
    return Response.json(bookings.filter((booking: any) => booking.userId === userId));
  }

  return Response.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();
  const bookings = db.bookings || [];
  const newBooking = { id: String(Date.now()), ...body, createdAt: new Date().toISOString() };
  db.bookings = [...bookings, newBooking];
  await writeDb(db);
  return Response.json(newBooking);
}
