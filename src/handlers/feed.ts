import { fetchFeed } from "src/utils/feed";

export async function getFeedHandler(cmdName: string, ...args: string[]) {
  // const feedURL = args[0];
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed));
}
