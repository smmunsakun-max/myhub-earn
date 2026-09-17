const express = require("express");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL = "@myhubbotmoney";
const CHANNEL_LINK = "https://t.me/myhubbotmoney";

async function telegram(method, data) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );

  return response.json();
}

app.get("/", (req, res) => {
  res.send("MyHub Earn Bot is running!");
});

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const text = message.text || "";

    if (text === "/start") {
      await telegram("sendMessage", {
        chat_id: chatId,
        text:
          "🎉 Welcome to MyHub Earn!\n\n" +
          "আমাদের Telegram Channel-এ Join করুন।\n\n" +
          "Join করার পর নিচের Verify বাটনে চাপুন।",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 Join Channel",
                url: CHANNEL_LINK
              }
            ],
            [
              {
                text: "✅ Verify Join",
                callback_data: "verify"
              }
            ],
            [
              {
                text: "👥 Refer & Earn",
                callback_data: "referral"
              }
            ]
          ]
        }
      });
    }

    if (req.body.callback_query) {
      const query = req.body.callback_query;
      const userId = query.from.id;
      const queryId = query.id;

      if (query.data === "verify") {
        const result = await telegram("getChatMember", {
          chat_id: CHANNEL,
          user_id: userId
        });

        const status = result?.result?.status;

        if (
          status === "member" ||
          status === "administrator" ||
          status === "creator"
        ) {
          await telegram("answerCallbackQuery", {
            callback_query_id: queryId,
            text: "✅ Join verified successfully!"
          });

          await telegram("sendMessage", {
            chat_id: userId,
            text:
              "🎉 আপনার Channel Join verify হয়েছে!\n\n" +
              "👥 এখন আপনার Referral Link
