const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:5000";

export async function GET() {
  const res = await fetch(`${JSON_SERVER_URL}/halls`);
  if (!res.ok) {
    return new Response("Failed to fetch halls", { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}
