import {
  fetchFeed,
  printFeed,
  printNewFollowFeed,
  scrapeFeeds,
} from "src/utils/feed";
import {
  createFeed,
  createFeedFollow,
  deleteFeedFollow,
  getAllFeeds,
  getFeedByUrl,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed";
import { readConfig } from "src/config";
import { Feed, FeedFollow, User } from "src/lib/db/schema";
import { getUserByID, getUserByName } from "src/lib/db/queries/users";

export async function getFeedHandler(cmdName: string, ...args: string[]) {
  // const feedURL = args[0] || "https://www.wagslane.dev/index.xml";
  // const feed = await fetchFeed(feedURL);
  // console.log(JSON.stringify(feed));
  await scrapeFeeds();
}

export async function addFeedHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const name = args[0];
  const url = args[1];
  if (!name || !url) {
    throw new Error("usage: addfeed <name> <rule>");
  }
  // const { currentUserName } = readConfig();
  // //   console.log(name, url, currentUserName);
  // const user: User = await getUserByName(currentUserName);
  // //   console.log(user);
  const feed: Feed = await createFeed(name, url, user.id);
  console.log(`Feed ${feed.name} was created.`);
  // await printFeed(feed, user);
  const feedFollow: FeedFollow = await createFeedFollow(feed.id, user.id);
  await printNewFollowFeed(feedFollow.id);
}

export async function feedsHandler(cmdName: string, ...args: string[]) {
  const feeds = await getAllFeeds();
  for (let item of feeds) {
    console.log(item.name);
    console.log(`  - ${item.url}`);
    console.log(`  - ${(await getUserByID(item.user_id)).name}`);
  }
}

export async function followFeedHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const url = args[0];
  // const { currentUserName } = readConfig();
  // const user: User = await getUserByName(currentUserName);
  const feed: Feed = await getFeedByUrl(url);
  const feedFollow: FeedFollow = await createFeedFollow(feed.id, user.id);
  await printNewFollowFeed(feedFollow.id);
}

export async function followingFeedHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  // const { currentUserName } = readConfig();
  // // console.log(currentUserName);
  // const user: User = await getUserByName(currentUserName);
  // console.log("user", user);
  const feedsForFollers = await getFeedFollowsForUser(user.id);
  console.log(`Current user ${user.name} is following:`);
  for (let i = 0; i < feedsForFollers.length; i++) {
    console.log(` - ${feedsForFollers[i].feed}`);
  }
}

export async function unfollowFeedHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedUrl = args[0];
  const feed: Feed = await getFeedByUrl(feedUrl);

  const deletedFeed = await deleteFeedFollow(feed.id, user.id);
  if (!deletedFeed) {
    throw new Error("Problem Deleting User");
  }
  console.log(
    `${user.name} is no longer following ${feed.name} at ${feed.url}`,
  );
}
