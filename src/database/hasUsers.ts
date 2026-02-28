"use server";

import { db } from "@/database/database";
import { Result } from "@/types/result";

export async function hasUsers(): Promise<Result<boolean, string>> {
  try {
    const user = await db
      .selectFrom("users")
      .select("username")
      .limit(1)
      .executeTakeFirst();

    return { success: true, value: !!user };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error checking users" };
  }
}
