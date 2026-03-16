import { fetchFeed, printFeed, printFollowFeed } from "src/utils/feed";
import {
  createFeed,
  createFeedFollow,
  getAllFeeds,
  getFeedByUrl,
} from "src/lib/db/queries/feed";
import { readConfig } from "src/config";
import { Feed, FeedFollow, User } from "src/lib/db/schema";
import { getUserByID, getUserByName } from "src/lib/db/queries/users";

export async function getFeedHandler(cmdName: string, ...args: string[]) {
  const feedURL = args[0] || "https://www.wagslane.dev/index.xml";
  const feed = await fetchFeed(feedURL);
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
  const user: User = await getUserByName(currentUserName);
  //   console.log(user);
  const feed: Feed = await createFeed(name, url, user.id);
  console.log(`Feed ${feed.name} was created.`);
  await printFeed(feed, user);
}

export async function feedsHandler(cmdName: string, ...args: string[]) {
  const feeds = await getAllFeeds();
  for (let item of feeds) {
    console.log(item.name);
    console.log(`  - ${item.url}`);
    console.log(`  - ${(await getUserByID(item.user_id)).name}`);
  }
}

export async function followFeedHandler(cmdName: string, ...args: string[]) {
  const url = args[0];
  const { currentUserName } = readConfig();
  const user: User = await getUserByName(currentUserName);
  const feed: Feed = await getFeedByUrl(url);
  const feedFollow: FeedFollow = await createFeedFollow(feed.id, user.id);
  await printFollowFeed(feedFollow.id);
}
