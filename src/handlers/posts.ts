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
  // console.log(userPosts);
}
