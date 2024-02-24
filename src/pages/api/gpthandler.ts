import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

interface Service {
  name: string;
  description: string;
}

interface ArchitectureOption {
  name: string;
  description: string;
}

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

  const servicesPath = path.join(
    __dirname,
    "../../../../templates/services.json"
  );
  const archOptionsPath = path.join(
    __dirname,
    "../../../../templates/architectures.json"
  );

  const awsServices = JSON.parse(
    fs.readFileSync(servicesPath, "utf8")
  ) as Service[];
  const serviceOptions = Object.values(
    JSON.parse(fs.readFileSync(archOptionsPath, "utf8")) as {
      [key: string]: ArchitectureOption;
    }
  );

  let archString = "Service Options:\n";
  for (let i = 0; i < serviceOptions.length; i++) {
    archString += `${i + 1}. ${serviceOptions[i].name}\n`;
  }

  let servicesString = "AWS Services:\n";
  for (let i = 0; i < awsServices.length; i++) {
    servicesString += `${i + 1}. ${awsServices[i].name}, Description: ${
      awsServices[i].description
    }\n`;
  }

  console.log(archString);
  console.log(servicesString);

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: "system",
        content: `This is a system that recommends Cloud service options based on a project description. Here are the available architecture options and the Cloud services they use:\n${archString}\n${servicesString}`,
      },
      {
        role: "system",
        content: `When you've made a choice, please format your response as follows: "Arch Indexes Chosen: <index1, index2, ...>, Short Explanation Why: <explanation>"`,
      },
      {
        role: "user",
        content: `\nThe project is about: ${userInput}\n Select the best Cloud service options from the ones listed above.`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
  };

  const chatCompletion = await openai.chat.completions.create(params);
  console.log(chatCompletion.choices[0].message.content);

  const output = chatCompletion.choices[0].message.content;
  const match = output?.match(
    /Arch Indexes Chosen: ([\d, ]+), Short Explanation Why: (.*)/
  );

  if (match) {
    const [_, archIndexes, shortExplanationWhy] = match;
    const archIndexesArray = archIndexes.split(',').map(index => parseInt(index.trim()));
    res
      .status(200)
      .json({
        archIndexes: archIndexesArray,
        shortExplanationWhy,
      });
  } else {
    res.status(400).json({ error: "Output doesn't match the expected format" });
  }
}
