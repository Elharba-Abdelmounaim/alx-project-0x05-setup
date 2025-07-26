import ImageCard from "@/components/common/ImageCard";
import { ImageProps } from "@/interfaces";
import React, { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    const resp = await fetch('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!resp.ok) {
      setIsLoading(false);
      return;
    }

    const data = await resp.json();
    setIsLoading(false);
    setImageUrl(data?.message);
    setGeneratedImages((prev) => [...prev, { imageUrl: data?.message, prompt }]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-tr from-slate-900 to-slate-700 text-white p-6">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">🎨 AI Image Generator</h1>
        <p className="text-lg text-slate-300 mb-6">
          Describe anything and get a beautiful image in seconds.
        </p>
        <div className="w-full">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Try: A futuristic city at sunset..."
            className="w-full p-4 rounded-xl text-black focus:outline-none text-white shadow-lg mb-4"
          />
          <button
            onClick={handleGenerateImage}
            className="w-full p-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg"
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </div>
      </div>

      {imageUrl && (
        <div className="mt-8">
          <ImageCard
            action={() => setImageUrl(imageUrl)}
            imageUrl={imageUrl}
            prompt={prompt}
          />
        </div>
      )}

      {generatedImages.length > 0 && (
        <div className="mt-10 w-full">
          <h3 className="text-2xl font-semibold text-center mb-4">✨ Your Generated Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto p-4 overflow-y-auto h-96 rounded-lg bg-slate-800 shadow-inner">
            {generatedImages.map(({ imageUrl, prompt }: ImageProps, index) => (
              <ImageCard
                action={() => setImageUrl(imageUrl)}
                imageUrl={imageUrl}
                prompt={prompt}
                key={index}
                width="w-full"
                height="h-40"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
