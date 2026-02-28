"use server";

import { db } from "@/database/database";
import { Result } from "@/types/result";

export type AdminUser = {
  username: string;
  role: string;
};

export async function getAllUsers(): Promise<Result<AdminUser[], string>> {
  try {
    const users = await db
      .selectFrom("users")
      .select(["username", "role"])
      .orderBy("username", "asc")
      .execute();

    return { success: true, value: users };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error fetching users" };
  }
}

export async function createUser(
  username: string,
  hashedPassword: string,
  role: string,
): Promise<Result<string, string>> {
  try {
    const existing = await db
      .selectFrom("users")
      .select("username")
      .where("username", "=", username)
      .executeTakeFirst();

    if (existing) {
      return { success: false, error: "Username already exists" };
    }

    await db
      .insertInto("users")
      .values({
        username,
        password: hashedPassword,
        role,
      })
      .executeTakeFirst();

    return { success: true, value: "User created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error creating user" };
  }
}

export async function updateUserRole(
  username: string,
  role: string,
): Promise<Result<string, string>> {
  try {
    const result = await db
      .updateTable("users")
      .set({ role })
      .where("username", "=", username)
      .executeTakeFirst();

    if (!result.numUpdatedRows) {
      return { success: false, error: "User not found" };
    }

    return { success: true, value: "Role updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error updating user role" };
  }
}

export async function deleteUser(
  username: string,
): Promise<Result<string, string>> {
  try {
    const result = await db
      .deleteFrom("users")
      .where("username", "=", username)
      .executeTakeFirst();

    if (!result.numDeletedRows) {
      return { success: false, error: "User not found" };
    }

    return { success: true, value: "User deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error deleting user" };
  }
}

export async function resetUserPassword(
  username: string,
  hashedPassword: string,
): Promise<Result<string, string>> {
  try {
    const result = await db
      .updateTable("users")
      .set({ password: hashedPassword })
      .where("username", "=", username)
      .executeTakeFirst();

    if (!result.numUpdatedRows) {
      return { success: false, error: "User not found" };
    }

    return { success: true, value: "Password reset successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error resetting password" };
  }
}
