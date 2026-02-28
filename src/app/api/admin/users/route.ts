import {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "@/database/adminUsers";
import { getSession } from "@/helpers/getsession";
import { jsonParser } from "@/helpers/jsonParser";
import { passwordHash } from "@/helpers/hashing";

export async function GET() {
  const token = await getSession();
  if (!token.success) {
    return new Response("Unauthorized access", { status: 401 });
  }

  if (token.value.role !== "admin") {
    return new Response("Unauthorized access", { status: 403 });
  }

  const result = await getAllUsers();
  if (!result.success) {
    return new Response(result.error, { status: 500 });
  }

  return Response.json(result.value);
}

export async function POST(request: Request) {
  const token = await getSession();
  if (!token.success) {
    return new Response("Unauthorized access", { status: 401 });
  }

  if (token.value.role !== "admin") {
    return new Response("Unauthorized access", { status: 403 });
  }

  const json = await request.text();
  const data = jsonParser<{ username: string; password: string; role: string }>(
    json,
  );
  if (!data.success) {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!data.value.username || !data.value.password || !data.value.role) {
    return new Response("Username, password, and role are required", {
      status: 400,
    });
  }

  if (data.value.role !== "admin" && data.value.role !== "user") {
    return new Response("Role must be 'admin' or 'user'", { status: 400 });
  }

  const hashed = await passwordHash(data.value.password);
  if (!hashed.success) {
    return new Response("Error hashing password", { status: 500 });
  }

  const result = await createUser(
    data.value.username,
    hashed.value,
    data.value.role,
  );
  if (!result.success) {
    return new Response(result.error, { status: 400 });
  }

  return Response.json({ message: result.value });
}

export async function PUT(request: Request) {
  const token = await getSession();
  if (!token.success) {
    return new Response("Unauthorized access", { status: 401 });
  }

  if (token.value.role !== "admin") {
    return new Response("Unauthorized access", { status: 403 });
  }

  const json = await request.text();
  const data = jsonParser<{ username: string; role: string }>(json);
  if (!data.success) {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!data.value.username || !data.value.role) {
    return new Response("Username and role are required", { status: 400 });
  }

  if (data.value.role !== "admin" && data.value.role !== "user") {
    return new Response("Role must be 'admin' or 'user'", { status: 400 });
  }

  if (data.value.username === token.value.name) {
    return new Response("Cannot change your own role", { status: 400 });
  }

  const result = await updateUserRole(data.value.username, data.value.role);
  if (!result.success) {
    return new Response(result.error, { status: 404 });
  }

  return Response.json({ message: result.value });
}

export async function DELETE(request: Request) {
  const token = await getSession();
  if (!token.success) {
    return new Response("Unauthorized access", { status: 401 });
  }

  if (token.value.role !== "admin") {
    return new Response("Unauthorized access", { status: 403 });
  }

  const json = await request.text();
  const data = jsonParser<{ username: string }>(json);
  if (!data.success) {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!data.value.username) {
    return new Response("Username is required", { status: 400 });
  }

  if (data.value.username === token.value.name) {
    return new Response("Cannot delete your own account", { status: 400 });
  }

  const result = await deleteUser(data.value.username);
  if (!result.success) {
    return new Response(result.error, { status: 404 });
  }

  return Response.json({ message: result.value });
}
