import { readConfig } from "src/config";
import {
  Feed,
  feeds,
  User,
  users,
  feedFollows,
  FeedFollow,
  FeedFollowAllData,
} from "../schema";
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

export async function getFeedByUrl(url: string) {
  const [feed]: Feed[] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));
  return feed;
}

export async function getAllFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function createFeedFollow(feedId: string, userId: string) {
  // TODO  It should insert a feed follow record,
  // but then return all the fields from the feed follow as well as the names of the linked user
  // and feed.
  const results = await db
    .insert(feedFollows)
    .values({ feed_id: feedId, user_id: userId })
    .returning();
  //   console.log("results\n", result);
  const newFeedFollow = results[0];
  // console.log(newFeedFollow);
  return newFeedFollow;
}

export async function getSingleFeedFollowWithData(feedFollowId: string) {
  const [feedFollowData]: FeedFollowAllData[] = await db
    .select()
    .from(feedFollows)
    .where(eq(feedFollows.id, feedFollowId))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .innerJoin(users, eq(feedFollows.user_id, users.id));
  return feedFollowData;
}

export async function getFeedFollowsForUser(userId: string) {
  const results = await db
    .select({ feed: feeds.name })
    .from(feedFollows)
    .where(eq(feedFollows.user_id, userId))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id));
  return results;
}
