import { XMLParser } from "fast-xml-parser";
import { Feed, User } from "src/lib/db/schema";
import { getFeed } from "src/lib/db/queries/feed";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
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
      `failed to fetch feed: ${rawFeed.status} ${rawFeed.statusText}`
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
