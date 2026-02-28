"use server";

import { db } from "@/database/database";
import { Result } from "@/types/result";

export async function getAllPlayers(): Promise<Result<string[], string>> {
  try {
    const players = await db
      .selectFrom("players")
      .select("player_name")
      .orderBy("player_name", "asc")
      .execute();

    return {
      success: true,
      value: players.map((p) => p.player_name),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error fetching players" };
  }
}
