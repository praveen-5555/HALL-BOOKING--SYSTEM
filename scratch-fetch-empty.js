async function test() {
  const res = await fetch("http://127.0.0.1:5000/users?email=nonexistent@example.com");
  const text = await res.text();
  console.log("Empty search response:", text);
}
test();
