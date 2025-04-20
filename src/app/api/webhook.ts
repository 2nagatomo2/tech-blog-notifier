import type { NextApiRequest, NextApiResponse } from "next";

// ボディのパース設定を無効化（自前でJSONパースするため）
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // ボディを読み取る
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      console.log("受信データ:", body); // ここでLINEからのデータが見れる

      res.status(200).send("OK");
    });
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
