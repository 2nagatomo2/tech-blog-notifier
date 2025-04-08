import { NextResponse } from "next/server";
import { fetchFeed } from "@/app/lib/fetchFeed";

export async function GET() {
  const rssUrls = ["https://techblog.lycorp.co.jp/ja/feed/index.xml"];

  const allFeeds = await Promise.all(rssUrls.map(fetchFeed));

  const merged = allFeeds
    .flat()
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

  console.log("📡 RSS合計件数:", merged.length);

  return NextResponse.json(merged);
}
