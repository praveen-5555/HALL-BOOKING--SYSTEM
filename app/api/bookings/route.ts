const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:5000";

export async function GET() {
  const res = await fetch(`${JSON_SERVER_URL}/bookings`);
  if (!res.ok) {
    return new Response("Failed to fetch bookings", { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${JSON_SERVER_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      createdAt: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    return new Response("Failed to create booking", { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
