import { User, PostForSubmition, posts } from "../schema";
import { eq, and, sql, asc, or, inArray, desc } from "drizzle-orm";
import { db } from "..";
import { getFeedFollowsIdsForUser } from "./feed";

export async function createPost(post: PostForSubmition) {
  const newPost = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.url,
      feedId: post.feedId,
      description: post.description,
      publishedAt: post.publishedAt,
    })
    .onConflictDoNothing({ target: posts.url })
    .returning();
  return newPost[0] ?? null;
}

export async function getPostsForUser(
  user: User,
  limit: number,
  offSet: number,
) {
  const feedFollowIds = await getFeedFollowsIdsForUser(user.id);
  if (!feedFollowIds) {
    return [];
  }

  const results = await db
    .select()
    .from(posts)
    .where(inArray(posts.feedId, feedFollowIds))
    .orderBy(desc(posts.publishedAt))
    .offset(offSet)
    .limit(limit);
  // console.log(results);
  return results;
}
