import { getAllPlayers } from "@/database/getAllPlayers";
import { deletePlayer } from "@/database/deletePlayer";
import { getSession } from "@/helpers/getsession";
import { jsonParser } from "@/helpers/jsonParser";

export async function GET() {
  const token = await getSession();
  if (!token.success) {
    return new Response("Unauthorized access", { status: 401 });
  }

  if (token.value.role !== "admin") {
    return new Response("Unauthorized access", { status: 403 });
  }

  const result = await getAllPlayers();
  if (!result.success) {
    return new Response(result.error, { status: 500 });
  }

  return Response.json(result.value);
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
  const data = jsonParser<{ name: string }>(json);
  if (!data.success) {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!data.value.name) {
    return new Response("Name must be set", { status: 400 });
  }

  const result = await deletePlayer(data.value.name);
  if (!result.success) {
    return new Response(result.error, { status: 404 });
  }

  return Response.json({ message: result.value });
}
