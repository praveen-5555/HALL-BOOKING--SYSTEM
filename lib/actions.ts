"use server";



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
    // Check if user already exists
    const usersRes = await fetch(`http://127.0.0.1:5000/users?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
    const users = await usersRes.json();
    
    if (users && users.length > 0) {
      return { error: "User already exists with this email" };
    }

    // Create new user
    const newUser = {
      id: String(Date.now()), // Generate unique ID based on timestamp
      name,
      email,
      password, // In a real application, you should hash the password!
      role: role
    };

    // Save using JSON Server
    const createRes = await fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });

    if (!createRes.ok) {
      throw new Error("Failed to create user in json-server");
    }

    const savedUser = await createRes.json();
    const { password: _password, ...userWithoutPassword } = savedUser;
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
    const usersRes = await fetch(`http://127.0.0.1:5000/users?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
    const users = await usersRes.json();

    if (!users || users.length === 0) {
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
