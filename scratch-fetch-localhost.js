async function test() {
  try {
    const res = await fetch("http://localhost:5000/users?email=don@gmail.com");
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
