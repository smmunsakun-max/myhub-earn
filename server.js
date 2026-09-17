const express = require("express");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = "https://smmunsakun-max.github.io/myhub-earn/";

app.get("/", (req, res) => {
  res.send("MyHub Earn Bot is running!");
});

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body?.message;

    if (message?.text === "/start") {
      const chatId = message.chat.id;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🎉 Welcome to MyHub Earn!\n\n💰 আপনার earning dashboard খুলুন:",
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🚀 Open MyHub Earn",
                web_app: {
                  url: WEB_APP_URL
                }
              }
            ]]
          }
        })
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
