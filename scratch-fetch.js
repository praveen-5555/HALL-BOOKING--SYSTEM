async function test() {
  try {
    const res = await fetch("http://127.0.0.1:5000/users?email=don@gmail.com");
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
    
    // Also try testing to create
    const newUser = {
      id: String(Date.now()),
      name: "test",
      email: "test" + Date.now() + "@test.com",
      password: "123",
      role: "user"
    };

    const createRes = await fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    console.log("Create Status:", createRes.status);
    console.log("Create text:", await createRes.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
