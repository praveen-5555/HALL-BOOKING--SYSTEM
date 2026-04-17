import { readDb, writeDb } from "../../../lib/db";
import { Booking } from "../../../lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const db = await readDb();
  const bookings = db.bookings || [];

  if (userId) {
    return Response.json(bookings.filter((booking: Booking) => booking.userId === userId));
  }

  return Response.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();
  const bookings = db.bookings || [];
  const newBooking: Booking = { id: String(Date.now()), ...body, createdAt: new Date().toISOString() };
  db.bookings = [...bookings, newBooking];
  await writeDb(db);
  return Response.json(newBooking);
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get ID from URL path

  if (!id) {
    return Response.json({ error: "Booking ID required" }, { status: 400 });
  }

  const body = await request.json();
  const db = await readDb();
  const bookings = db.bookings || [];
  const bookingIndex = bookings.findIndex((booking: Booking) => booking.id === id);

  if (bookingIndex === -1) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  const updatedBooking = { ...bookings[bookingIndex], ...body };
  db.bookings[bookingIndex] = updatedBooking;
  await writeDb(db);

  return Response.json(updatedBooking);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get ID from URL path

  if (!id) {
    return Response.json({ error: "Booking ID required" }, { status: 400 });
  }

  const db = await readDb();
  const bookings = db.bookings || [];
  const bookingIndex = bookings.findIndex((booking: Booking) => booking.id === id);

  if (bookingIndex === -1) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  db.bookings = bookings.filter((booking: Booking) => booking.id !== id);
  await writeDb(db);

  return Response.json({ success: true });
}
