import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const replicateApiKey = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiKey) {
    return res.status(500).json({ error: "Missing REPLICATE_API_TOKEN" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${replicateApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a9758cb5eaaa66a2cda6a7c5b7cddbf95dd10863f7f644c49f6841cfc12cce4f", // Stable Diffusion
        input: {
          prompt: prompt,
        },
      }),
    });

    const prediction = await response.json();

    if (prediction?.error) {
      return res.status(500).json({ error: prediction.error });
    }

    // Poll the prediction until it finishes
    let generatedImage = null;
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      const pollRes = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${replicateApiKey}`,
          },
        }
      );
      const pollData = await pollRes.json();
      prediction.status = pollData.status;
      generatedImage = pollData.output?.[0] ?? null;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (prediction.status === "succeeded") {
      return res.status(200).json({ message: generatedImage });
    } else {
      return res.status(500).json({ error: "Failed to generate image" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
