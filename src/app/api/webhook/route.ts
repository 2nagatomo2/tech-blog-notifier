import { NextRequest, NextResponse } from "next/server";
import { sendPushMessage } from "@/app/lib/lineApi";
import crypto from "crypto";
import { fetchFeed } from "@/app/lib/fetchFeed";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-line-signature") as string;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  try {
    const body = await req.text();

    // 署名の検証
    const hash = crypto
      .createHmac("SHA256", channelSecret!)
      .update(body)
      .digest("base64");

    if (signature !== hash) {
      console.error("署名検証エラー");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("受信データ:", body);

    const json = JSON.parse(body);
    const event = json.events[0];

    if (!event) {
      console.log("イベントがありません");
      return NextResponse.json({ message: "OK" });
    }

    const userId = event.source.userId;

    console.log("送信先ユーザーID:", userId);

    // ここで記事情報を取得して送信
    if (event.message.text === "LINE") {
      const feed = await fetchFeed(
        "https://techblog.lycorp.co.jp/ja/feed/index.xml"
      );
      await sendPushMessage(userId, feed[0].link);
    } else if (
      event.message.text === "メルカリ" ||
      event.message.text === "mercari"
    ) {
      const feed = await fetchFeed(
        "https://engineering.mercari.com/blog/feed.xml"
      );
      await sendPushMessage(userId, feed[0].link);
    } else if (
      event.message.text === "クックパッド" ||
      event.message.text === "cookpad"
    ) {
      const feed = await fetchFeed("https://techlife.cookpad.com/rss");
      await sendPushMessage(userId, feed[0].link);
    } else {
      await sendPushMessage(userId, "");
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
