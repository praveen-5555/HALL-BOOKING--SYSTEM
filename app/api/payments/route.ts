import { readDb, writeDb } from "../../../lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("bookingId");
  const db = await readDb();
  const payments = db.payments || [];

  if (bookingId) {
    return Response.json(payments.filter((payment: any) => payment.bookingId === bookingId));
  }

  return Response.json(payments);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();
  const payments = db.payments || [];
  const newPayment = { id: String(Date.now()), ...body };
  db.payments = [...payments, newPayment];
  await writeDb(db);
  return Response.json(newPayment);
}
