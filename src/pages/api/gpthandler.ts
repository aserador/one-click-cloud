import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

interface AWS {
  name: string;
  description: string;
}

interface ServiceOption {
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

  const awsServicesPath = path.join(
    __dirname,
    "../../../../templates/aws_services.json"
  );
  const serviceOptionsPath = path.join(
    __dirname,
    "../../../../templates/service_options.json"
  );

  const awsServices = JSON.parse(
    fs.readFileSync(awsServicesPath, "utf8")
  ) as AWS[];
  const serviceOptions = Object.values(
    JSON.parse(fs.readFileSync(serviceOptionsPath, "utf8")) as {
      [key: string]: ServiceOption;
    }
  );

  let serviceOptionsString = "Service Options:\n";
  for (let i = 0; i < serviceOptions.length; i++) {
    serviceOptionsString += `${i + 1}. ${serviceOptions[i].name}\n`;
  }

  let awsServicesString = "AWS Services:\n";
  for (let i = 0; i < awsServices.length; i++) {
    awsServicesString += `${i + 1}. ${awsServices[i].name}, Description: ${
      awsServices[i].description
    }\n`;
  }

  // Create a prompt that includes the user's input and the service options
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: "system",
        content: `This is a system that recommends AWS service options based on a project description. Here are the available service options and the AWS services they use:\n${serviceOptionsString}\n${awsServicesString}`,
      },
      {
        role: "system",
        content: `When you've made a choice, please format your response as follows: "Service Index Chosen: <index>, Short Explanation Why: <explanation>"`,
      },
      {
        role: "user",
        content: `\nThe project is about: ${userInput}\n Select the best AWS service option from the ones listed above.`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
  };

  const chatCompletion = await openai.chat.completions.create(params);
  console.log(chatCompletion.choices[0].message.content);

  const output = chatCompletion.choices[0].message.content;
  const match = output?.match(
    /Service Index Chosen: (\d+), Short Explanation Why: (.*)/
  );

  if (match) {
    const [_, serviceIndexChosen, shortExplanationWhy] = match;
    res
      .status(200)
      .json({
        serviceIndexChosen: parseInt(serviceIndexChosen),
        shortExplanationWhy,
      });
  } else {
    res.status(400).json({ error: "Output doesn't match the expected format" });
  }
}
