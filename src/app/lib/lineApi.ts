import axios from "axios";

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

export async function sendPushMessage(userId: string, message: string) {
  const url = "https://api.line.me/v2/bot/message/push";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
  };
  const body = {
    to: userId,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log("送信成功:", response.data);
  } catch (error) {
    console.error("送信エラー:", error);
  }
}
