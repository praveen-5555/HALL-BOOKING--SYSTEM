"use server";

import { readDb, writeDb } from "./db";

// A server action to append a new user to db.json
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "user";

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    const db = await readDb();
    const users = db.users || [];

    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password, // In a real application, you should hash the password!
      role: role,
    };

    db.users = [...users, newUser];
    await writeDb(db);

    const { password: _password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error writing to database", error);
    return { error: "Failed to create user" };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const db = await readDb();
    const users = db.users || [];
    const filteredUsers = users.filter((user: any) => user.email === email);

    if (!filteredUsers || filteredUsers.length === 0) {
      return { error: "Invalid email or password" };
    }

    const user = users[0];

    // In a real app, hash and compare!
    if (user.password !== password) {
      return { error: "Invalid email or password" };
    }

    // Return user info (except password)
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error connecting to database", error);
    return { error: "Failed to login" };
  }
}
