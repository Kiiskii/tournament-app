import { hasUsers } from "@/database/hasUsers";
import { createUser } from "@/database/adminUsers";
import { jsonParser } from "@/helpers/jsonParser";
import { passwordHash } from "@/helpers/hashing";

export async function POST(request: Request) {
  const usersExist = await hasUsers();
  if (!usersExist.success) {
    return new Response("Error checking users", { status: 500 });
  }

  if (usersExist.value) {
    return new Response("Setup already completed", { status: 403 });
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

  const result = await createUser(data.value.username, hashed.value, "admin");
  if (!result.success) {
    return new Response(result.error, { status: 400 });
  }

  return Response.json({ message: "Admin account created" });
}
