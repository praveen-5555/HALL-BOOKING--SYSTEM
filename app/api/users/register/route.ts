import { readDb, writeDb } from "../../../../lib/db";
import { User } from "../../../../lib/types";

export async function POST(req: Request) {
  try {
    const { name, email, password, role = "user" } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const db = await readDb();
    const users = db.users || [];

    const existingUser = users.find((user: User) => user.email === email);
    if (existingUser) {
      return Response.json({ error: "User already exists with this email" }, { status: 409 });
    }

    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      password, // In a real application, you should hash the password!
      role: role as 'admin' | 'user',
    };

    db.users = [...users, newUser];
    await writeDb(db);

    const { password: _password, ...userWithoutPassword } = newUser;
    return Response.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}