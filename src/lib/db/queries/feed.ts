import { readConfig } from "src/config";
import { Feed, feeds } from "../schema";
import { eq, and } from "drizzle-orm";
import { db } from "..";

export async function createFeed(name: string, url: string, userID: string) {
  const result = await db
    .insert(feeds)
    .values({ name, url, user_id: userID })
    .returning();
  //   console.log("results\n", result);
  const newUser = result[0];
  return newUser;
}

export async function getFeed(feedID: string, userID: string) {
  const result = await db
    .select()
    .from(feeds)
    .where(and(eq(feeds.id, feedID), eq(feeds.user_id, userID)));
  return result;
}
