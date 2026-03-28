import { readConfig } from "src/config";
import {
  Feed,
  feeds,
  User,
  users,
  feedFollows,
  FeedFollow,
  FeedFollowAllData,
  PostForSubmition,
  posts,
} from "../schema";
import { eq, and, sql, asc } from "drizzle-orm";
import { db } from "..";

export async function createPost(post: PostForSubmition) {
  const newPost = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.url,
      feedId: post.feedId,
      publishedAt: post.publishedAt,
    })
    .onConflictDoNothing({ target: posts.url })
    .returning();
  return newPost[0] ?? null;
}
