import { getPostsForUser } from "src/lib/db/queries/post";
import { User } from "src/lib/db/schema";

export async function browseHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  // const limit = Number(args[0]) ?? 2;
  const limit = 2;
  console.log("limit: ", limit);
  let offSet = 0;
  const userPosts = await getPostsForUser(user, limit, offSet);

  console.log(`Found ${userPosts.length} posts for user ${user.name}`);
  for (let post of userPosts) {
    console.log(`<--- ${post.title} --->`);
    console.log(`     ${post.description}`);
    console.log(`Published at: ${post.publishedAt}`);
    console.log(`Link: ${post.url}`);
    console.log(`<----------------------------->`);
  }
}
