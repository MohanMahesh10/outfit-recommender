import React, { useState, useEffect } from 'react';
import { FaTshirt, FaSave, FaShareAlt, FaImage, FaSpinner, FaRedoAlt } from 'react-icons/fa';
import Image from 'next/image';

type OutfitRecommendationProps = {
  recommendation: string;
  preferences: {
    occasion: string;
    weather: string;
    style: string;
    gender: string;
  };
};

export default function OutfitRecommendation({ recommendation, preferences }: OutfitRecommendationProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Create a simplified summary from the recommendation
  const getSummary = (text: string) => {
    // Extract the first 2-3 lines or create a simple summary
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 0) {
      // Get first 3 meaningful lines
      return lines.slice(0, 3).join(' ').replace(/TOP:|BOTTOM:|OUTERWEAR:|SHOES:|ACCESSORIES:/g, '');
    }
    return `A ${preferences.style} outfit for ${preferences.occasion}, suitable for ${preferences.weather} weather.`;
  };

  // Generate an outfit image based on the recommendation
  const generateOutfitImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);
    
    try {
      // Create a simple prompt based on preferences for the consistory model
      const prompt = `${preferences.gender} wearing ${preferences.style} outfit for ${preferences.occasion}`;
      
      console.log("Generating image with prompt:", prompt);
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          outfitDescription: recommendation.substring(0, 200)
        }),
      });

      // Parse the response
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL returned from the API');
      }
      
      setOutfitImage(data.imageUrl);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error generating outfit image:', error);
      setImageError(error instanceof Error ? error.message : 'Failed to generate outfit image. Please try again.');
      setRetryCount((prev) => prev + 1);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Automatically generate the image when the component mounts with a recommendation
  useEffect(() => {
    if (recommendation && !outfitImage && !isGeneratingImage) {
      generateOutfitImage();
    }
  }, [recommendation]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full max-w-2xl border border-gray-100 dark:border-gray-700">
      <div className="bg-indigo-600 dark:bg-indigo-700 px-6 py-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <FaTshirt className="text-white" />
          <h2 className="text-xl font-bold">Your Outfit</h2>
        </div>
        <p className="text-indigo-100 text-sm">
          {preferences.style} {preferences.gender} look for {preferences.occasion} in {preferences.weather} weather
        </p>
      </div>
      
      <div className="p-6">
        {/* Single column layout with image as focus */}
        <div className="flex flex-col items-center">
          {/* Brief outfit description */}
          <p className="text-gray-700 dark:text-gray-300 text-center mb-5 max-w-lg">
            {getSummary(recommendation)}
          </p>

          {/* Image section */}
          {outfitImage ? (
            <div className="w-full max-w-lg">
              <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                {outfitImage.startsWith('data:') ? (
                  <img 
                    src={outfitImage} 
                    alt={`${preferences.style} outfit for ${preferences.occasion}`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Image
                    src={outfitImage}
                    alt={`${preferences.style} outfit for ${preferences.occasion}`}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          ) : isGeneratingImage ? (
            <div className="flex flex-col items-center justify-center py-10 h-[300px]">
              <FaSpinner className="animate-spin text-4xl text-indigo-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-300">Generating outfit visualization...</p>
            </div>
          ) : imageError ? (
            <div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                <p className="text-red-600 dark:text-red-400 text-sm mb-1">{imageError}</p>
              </div>
              <button
                onClick={generateOutfitImage}
                disabled={isGeneratingImage}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <FaRedoAlt />
                Retry Image Generation
              </button>
            </div>
          ) : null}
        </div>
        
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium">
            <FaSave />
            Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors text-sm font-medium">
            <FaShareAlt />
            Share
          </button>
        </div>
      </div>
    </div>
  );
} 