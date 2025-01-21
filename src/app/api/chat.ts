import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };

    const chatSession = await model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(req.body.prompt);
    res.status(200).json({ response: result.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
}
