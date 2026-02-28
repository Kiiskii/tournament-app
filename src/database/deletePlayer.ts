"use server";

import { db } from "@/database/database";
import { Result } from "@/types/result";

export async function deletePlayer(
  name: string,
): Promise<Result<string, string>> {
  try {
    const result = await db
      .deleteFrom("players")
      .where("player_name", "=", name)
      .executeTakeFirst();

    if (!result.numDeletedRows) {
      return { success: false, error: "Player not found" };
    }

    return { success: true, value: "Player deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error deleting player" };
  }
}
