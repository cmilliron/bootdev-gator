import { fetchFeed, printFeed } from "src/utils/feed";
import { createFeed } from "src/lib/db/queries/feed";
import { readConfig } from "src/config";
import { Feed, User } from "src/lib/db/schema";
import { getUser } from "src/lib/db/queries/users";

export async function getFeedHandler(cmdName: string, ...args: string[]) {
  // const feedURL = args[0];
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed));
}

export async function addFeedHandler(cmdName: string, ...args: string[]) {
  const name = args[0];
  const url = args[1];
  if (!name || !url) {
    throw new Error("usage: addfeed <name> <rule>");
  }
  const { currentUserName } = readConfig();
  //   console.log(name, url, currentUserName);
  const user: User = await getUser(currentUserName);
  //   console.log(user);
  const feed: Feed = await createFeed(name, url, user.id);
  console.log(`Feed ${feed.name} was created.`);
  await printFeed(feed, user);
}
