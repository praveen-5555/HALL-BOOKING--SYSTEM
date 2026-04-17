import { readDb } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await readDb();
    const users = db.users || [];
    const user = users.find((user: any) => user.email === email);

    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.password !== password) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Return user info (except password)
    const { password: _password, ...userWithoutPassword } = user;
    return Response.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Failed to login" }, { status: 500 });
  }
}