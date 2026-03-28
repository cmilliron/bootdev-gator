import { XMLParser } from "fast-xml-parser";
import { Feed, FeedFollow, PostForSubmition, User } from "src/lib/db/schema";
import {
  getFeed,
  getNextFeedToFetch,
  getSingleFeedFollowWithData,
  markFeedFetched,
} from "src/lib/db/queries/feed";
import { createPost } from "src/lib/db/queries/post";

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
  // console.log(parsedFeed);
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

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  const feedId = nextFeed.id;
  const updatedFeed = await markFeedFetched(nextFeed.id);
  if (!updatedFeed) {
    throw Error("Error updating Feed");
  }
  const feedData = await fetchFeed(nextFeed.url);
  console.log(`Articles from ${nextFeed.name}:`);
  let counter = 0;
  if (feedData.channel.item.length > 0) {
    for (let item of feedData.channel.item) {
      let pubDate = new Date(item.pubDate);

      const newPost: PostForSubmition = {
        title: item.title,
        description: item.description,
        url: item.link,
        feedId: feedId,
        publishedAt: pubDate,
      };
      const response = await createPost(newPost);
      if (!response) {
        console.log(`${newPost.title} already exists`);
        continue;
      }
      console.log(` * ${response.title} was add to the post database`);

      // console.log();
      counter++;
      if (counter > 10) {
        break;
      }
    }
  }
}

export async function getPostForUser() {}
