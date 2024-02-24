import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'
import fs from 'fs';
import path from 'path';

interface AWS {
  name: string;
  description: string;
}

interface ServiceOption {
  name: string;
  description: string;
}

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], 
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get userInput from req.body instead of req.query
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "User input missing" });
  }

  if (userInput.length > 100) {
    return res.status(400).json({ error: "User input too long" });
  }

  // Use path.join to create the path to the files
  const awsServicesPath = path.join(__dirname, '../../../../templates/aws_services.json');
  const serviceOptionsPath = path.join(__dirname, '../../../../templates/service_options.json');

// Use fs.readFileSync to read the files
const awsServices = JSON.parse(fs.readFileSync(awsServicesPath, 'utf8')) as AWS[];
const serviceOptions = Object.values(JSON.parse(fs.readFileSync(serviceOptionsPath, 'utf8')) as { [key: string]: ServiceOption });

// Create a string that lists all the service options
let serviceOptionsString = 'Service Options:\n';
for (let i = 0; i < serviceOptions.length; i++) {
  serviceOptionsString += `${i + 1}. ${serviceOptions[i].name}\n`;
}

// Create a string that lists all the AWS services
let awsServicesString = 'AWS Services:\n';
for (let i = 0; i < awsServices.length; i++) {
  awsServicesString += `${i + 1}. ${awsServices[i].name}, Description: ${awsServices[i].description}\n`;
}

  // Create a prompt that includes the user's input and the service options
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: 'system', content: `This is a system that recommends AWS service options based on a project description. Here are the available service options and the AWS services they use:\n${serviceOptionsString}\n${awsServicesString}` },
      { role: 'user', content: `\nThe project is about: ${userInput}\n Select the best AWS service option from the ones listed above.` },
    ],
    model: 'gpt-3.5-turbo',
    max_tokens: 700,
  };

  const chatCompletion = await openai.chat.completions.create(params);
  console.log(chatCompletion.choices[0].message.content);

  res.status(200).json({ output: chatCompletion.choices[0].message.content });
}