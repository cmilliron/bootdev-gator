import { XMLParser } from "fast-xml-parser";
import { Feed, FeedFollow, User } from "src/lib/db/schema";
import { getFeed, getSingleFeedFollowWithData } from "src/lib/db/queries/feed";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const headers = {
    "User-Agent": "gator",
    accept: "application/rss+xml",
  };
  const rawFeed = await fetch(feedURL, {
    method: "GET",
    headers: headers,
  });

  if (!rawFeed.ok) {
    throw new Error(
      `failed to fetch feed: ${rawFeed.status} ${rawFeed.statusText}`,
    );
  }

  const rawFeedAsText = await rawFeed.text(); // add header
  const xmlParser = new XMLParser();
  const parsedFeed = xmlParser.parse(rawFeedAsText);
  console.log(parsedFeed);
  // Error Checking
  let itemList: RSSItem[];
  if (!parsedFeed.rss.channel) {
    if (
      !parsedFeed.rss.channel.title ||
      !parsedFeed.rss.channel.link ||
      !parsedFeed.rss.channel.description
    ) {
      throw new Error("failed to parse channel");
    }
  }

  if (Array.isArray(parsedFeed.rss.channel.item)) {
    itemList = parsedFeed.rss.channel.item.map((i: RSSItem) => {
      if (!i.title || !i.link || !i.description || !i.pubDate) {
        return;
      } else {
        return {
          title: i.title,
          link: i.link,
          description: i.description,
          pubDate: i.pubDate,
        };
      }
    });
  } else {
    itemList = [];
  }

  const rssFeed: RSSFeed = {
    channel: {
      title: parsedFeed.rss.channel.title,
      link: parsedFeed.rss.channel.link,
      description: parsedFeed.rss.channel.description,
      item: itemList,
    },
  };

  return rssFeed;
}

export async function printFeed(feed: Feed, user: User) {
  const feedData = await getFeed(feed.id, user.id);
  console.log(feedData);
}

export async function printNewFollowFeed(followFeedId: string) {
  const feedFollowData = await getSingleFeedFollowWithData(followFeedId);
  // console.log(feedFollowData);
  console.log(
    `Feed ${feedFollowData.feeds.name} is now followed by ${feedFollowData.users.name}`,
  );
}

//Add a markFeedFetched function.
// It should simply set the last_fetched_at and updated_at columns to the current time
// for a given feed (probably by ID is simplest).
export async function markFeedFetched(feedId: string) {}

// Add a getNextFeedToFetch function.
// It should return the next feed we should fetch posts from.
// We want to scrape all the feeds in a continuous loop.
// A simple approach is to keep track of when a feed was last fetched,
// and always fetch the oldest one first (or any that haven't ever been fetched).
// SQL has a NULLS FIRST clause that can help with this.
// Drizzle has a sql operator that lets you write raw SQL queries when the ORM syntax isn't enough.
export async function getNextFeedToFetch(feedId: string) {}
