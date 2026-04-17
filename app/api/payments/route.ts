import { readDb, writeDb } from "../../../lib/db";
import { Payment } from "../../../lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("bookingId");
  const db = await readDb();
  const payments = db.payments || [];

  if (bookingId) {
    return Response.json(payments.filter((payment: Payment) => payment.bookingId === bookingId));
  }

  return Response.json(payments);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();
  const payments = db.payments || [];
  const newPayment: Payment = { id: String(Date.now()), ...body };
  db.payments = [...payments, newPayment];
  await writeDb(db);
  return Response.json(newPayment);
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get ID from URL path

  if (!id) {
    return Response.json({ error: "Payment ID required" }, { status: 400 });
  }

  const body = await request.json();
  const db = await readDb();
  const payments = db.payments || [];
  const paymentIndex = payments.findIndex((payment: Payment) => payment.id === id);

  if (paymentIndex === -1) {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  const updatedPayment = { ...payments[paymentIndex], ...body };
  db.payments[paymentIndex] = updatedPayment;
  await writeDb(db);

  return Response.json(updatedPayment);
}
