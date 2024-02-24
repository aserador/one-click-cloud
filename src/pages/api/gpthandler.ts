import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import { SERVICES } from "../../../templates/services";
import { ARCHITECTURES } from "../../../templates/architectures";

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

  const cloudServices = Object.values(SERVICES) as Service[];
  const archOptions = ARCHITECTURES as ArchitectureOption[];

  let archString = "Architecture Options:\n";
  for (let i = 0; i < archOptions.length; i++) {
    archString += `${i + 1}. ${archOptions[i].name}\n`;
  }

  let servicesString = "Cloud Services:\n";
  for (let i = 0; i < cloudServices.length; i++) {
    servicesString += `${i + 1}. ${cloudServices[i].name}, Description: ${
      cloudServices[i].description
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
        content: `\nThe project is about: ${userInput}\n Select the best Cloud service options (each separate from each other) from the ones listed above (Maximum 3)`,
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