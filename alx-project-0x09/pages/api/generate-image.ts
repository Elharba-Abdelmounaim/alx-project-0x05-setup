import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const gptApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  const gptUrl = "https://chatgpt-42.p.rapidapi.com/aitohuman";

  if (!gptApiKey || !gptUrl) {
    return response.status(500).json({ error: "API key or URL is missing in environment variables" });
  }

  try {
    const { prompt }: RequestProps = request.body;

   const res = await fetch(gptUrl, {
    method: "POST",
    body: JSON.stringify({ text: prompt }),
    headers: {
        'x-rapidapi-key': gptApiKey.trim(),
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
  },
});

    if (!res.ok) {
      throw new Error("Failed to fetch from DALLE");
    }

    const data = await res.json();
    console.log("🔥 Full API response:", data);
    return response.status(200).json({
        message: data?.image_url || "https://via.placeholder.com/600x400?text=Generated+Image"
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
