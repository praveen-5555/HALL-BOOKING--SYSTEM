const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:5000";

export async function GET() {
  const res = await fetch(`${JSON_SERVER_URL}/users`);
  if (!res.ok) {
    return new Response("Failed to fetch users", { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${JSON_SERVER_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return new Response("Failed to create user", { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
