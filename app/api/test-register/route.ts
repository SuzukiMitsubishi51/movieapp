export async function GET() {
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "test1@example.com",
      password: "123456",
    }),
  });

  const data = await res.json();

  return Response.json(data);
}