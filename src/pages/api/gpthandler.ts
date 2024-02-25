import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "User input missing" });
  }

  if (userInput.length > 1000) {
    return res.status(400).json({ error: "User input too long" });
  }

  const params_react: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: "system",
        content: `You are a bot that identifies whether a tech stack can produce a static file output (eg. React, Plain HTML/CSS) or not.`,
      },
      {
        role: "system",
        content: `When you've made a choice, please reply only using the words true or false. DO NOT include any other information in your response. DO NOT use more than one word. If you are unsure, reply with false.`,
      },
      {
        role: "user",
        content: `\nThe tech stack is : ${userInput}\n`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
  };

  const chatCompletionReact = await openai.chat.completions.create(params_react);
  console.log(chatCompletionReact.choices[0].message.content);

  var using_react = false;
  const output_react = chatCompletionReact.choices[0].message.content;
  if (output_react === "true") {
    using_react = true;
  }

  
  const params_backend: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: "system",
        content: `You are a bot that identifies whether a tech stack has a backend. If it has a backend (like PHP, Node,js, Django etc.), reply with true. Otherwise, reply with false.`,
      },
      {
        role: "system",
        content: `When you've made a choice, please reply only using the words true or false. DO NOT include any other information in your response. DO NOT use more than one word. If you are unsure, reply with true.`,
      },
      {
        role: "user",
        content: `\nThe tech stack is : ${userInput}\n`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
  };

  const chatCompletionBackend = await openai.chat.completions.create(params_backend);
  console.log(chatCompletionBackend.choices[0].message.content);

  var using_backend = true;
  const output_backend = chatCompletionBackend.choices[0].message.content;
  if (output_backend === "false") {
    using_backend = false;
  }

  res
    .status(200)
    .json({
      using_react: using_react,
      using_backend: using_backend,
    });
}