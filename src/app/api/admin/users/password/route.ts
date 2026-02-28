import { resetUserPassword } from "@/database/adminUsers";
import { getSession } from "@/helpers/getsession";
import { jsonParser } from "@/helpers/jsonParser";
import { passwordHash } from "@/helpers/hashing";

export async function PUT(request: Request) {
  const token = await getSession();
  if (!token.success) {
    return new Response("Unauthorized access", { status: 401 });
  }

  if (token.value.role !== "admin") {
    return new Response("Unauthorized access", { status: 403 });
  }

  const json = await request.text();
  const data = jsonParser<{ username: string; password: string }>(json);
  if (!data.success) {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!data.value.username || !data.value.password) {
    return new Response("Username and password are required", { status: 400 });
  }

  const hashed = await passwordHash(data.value.password);
  if (!hashed.success) {
    return new Response("Error hashing password", { status: 500 });
  }

  const result = await resetUserPassword(data.value.username, hashed.value);
  if (!result.success) {
    return new Response(result.error, { status: 404 });
  }

  return Response.json({ message: result.value });
}
