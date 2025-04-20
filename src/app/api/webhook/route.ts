import { NextRequest, NextResponse } from "next/server";
import { sendPushMessage } from "@/app/lib/lineApi";
import crypto from "crypto";

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
    await sendPushMessage(userId, "新しい記事が公開されました！");

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
