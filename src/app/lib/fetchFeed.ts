import Parser from "rss-parser";

export type BlogEntry = {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  creator?: string;
};

const parser = new Parser();

export async function fetchFeed(rssUrl: string): Promise<BlogEntry[]> {
  console.log("🔄 start fetching feed:", rssUrl);
  try {
    const feed = await parser.parseURL(rssUrl);

    return feed.items.map((item: any) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      thumbnail: item.thumbnail || "",
      creator: item.creator || "",
    }));
  } catch (error) {
    console.log(`❌ failed to fetch ${rssUrl}: `, error);
    return [];
  } finally {
    console.log("✅ finished fetching:", rssUrl);
  }
}
