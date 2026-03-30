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
import { eq, and, sql, asc } from "drizzle-orm";
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
export async function getFeedFollowsIdsForUser(userId: string) {
  const results = await db
    .select({ feedId: feedFollows.feed_id })
    .from(feedFollows)
    .where(eq(feedFollows.user_id, userId))
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id));
  const idsOnly = results.map((x) => x.feedId);
  return idsOnly;
}

export async function deleteFeedFollow(feedId: string, userId: string) {
  const results = await db
    .delete(feedFollows)
    .where(
      and(eq(feedFollows.feed_id, feedId), eq(feedFollows.user_id, userId)),
    )
    .returning();

  return results;
}

export async function markFeedFetched(feedId: string) {
  // Updates the last last_fetched_at column and (updated at) to current time.
  const results = await db
    .update(feeds)
    .set({ lastFetchedAt: sql`NOW()` })
    .where(eq(feeds.id, feedId))
    .returning();
  // console.log("Feed last_fetched_time updated. Results are:");
  console.log(results);
  return results[0];
}

export async function getNextFeedToFetch() {
  const results: Feed[] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`);
  const nextFeed = results[0];
  return nextFeed;
}
