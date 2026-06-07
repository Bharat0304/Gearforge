import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

async function main() {
  try {
    const response = await client.chat.send({
      chatRequest: {
        model: "~anthropic/claude-sonnet-latest",
        maxTokens: 10,
        messages: [{ role: "user", content: "hello" }]
      }
    });
    console.log("SUCCESS!", response.choices?.[0]?.message?.content);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
main();
