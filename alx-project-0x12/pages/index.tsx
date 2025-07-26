import ImageCard from "@/components/common/ImageCard";
import { ImageProps } from "@/interfaces";
import React, { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    const resp = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!resp.ok) {
      setIsLoading(false);
      return;
    }

    const data = await resp.json();
    setIsLoading(false);
    setImageUrl(data?.message);
    setGeneratedImages((prev) => [
      ...prev,
      { imageUrl: data?.message, prompt },
    ]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="w-full max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">🎨 Image Generator</h1>
        <p className="text-md text-gray-300">
          Enter your prompt and generate beautiful images using AI!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center mt-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image..."
            className="flex-1 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 text-white focus:ring-purple-500 w-full"
          />
          <button
            onClick={handleGenerateImage}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-3 rounded-lg transition duration-200 w-full sm:w-auto"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {imageUrl && (
        <div className="mt-8 w-full max-w-md text-white">
          <ImageCard action={() => setImageUrl(imageUrl)} imageUrl={imageUrl} prompt={prompt} />
        </div>
      )}

      {generatedImages.length > 0 && (
        <div className="mt-12 w-full max-w-7xl">
          <h2 className="text-2xl font-semibold text-center mb-4">🖼️ Your Generated Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {generatedImages.map(({ imageUrl, prompt }: ImageProps, index) => (
              <ImageCard
                key={index}
                imageUrl={imageUrl}
                prompt={prompt}
                action={() => setImageUrl(imageUrl)}
                width="w-full"
                height="h-48"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
