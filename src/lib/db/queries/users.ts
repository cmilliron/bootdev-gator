import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
  const res = await db
    .insert(users)
    .values({ name: name })
    .onConflictDoNothing({ target: users.name })
    .returning();
  if (!res) {
    throw new Error("User already exists");
  }
  const result = res[0];
  return result;
}

export async function getUserByName(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return result[0];
}

export async function getUserByID(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function deleteAllUsers() {
  const deleteUsers = await db.delete(users);
  return deleteUsers;
}

export async function getAllUsers() {
  const results = await db.select().from(users);
  return results;
}
