import { readDb } from "../../../../lib/db";
import { Hall } from "../../../../lib/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const halls = db.halls || [];
  const hall = halls.find((hall: Hall) => hall.id === id);

  if (!hall) {
    return Response.json({ error: "Hall not found" }, { status: 404 });
  }

  return Response.json(hall);
}