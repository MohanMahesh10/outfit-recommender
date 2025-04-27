"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreferenceForm from "@/components/PreferenceForm";
import OutfitRecommendation from "@/components/OutfitRecommendation";
import { generateOutfitRecommendation } from "@/utils/gemini";
import { FaLightbulb, FaThumbsUp, FaShoppingBag, FaMagic } from "react-icons/fa";

type PreferenceData = {
  occasion: string;
  weather: string;
  style: string;
  gender: string;
  additionalNotes?: string;
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [preferences, setPreferences] = useState<PreferenceData>({
    occasion: "",
    weather: "",
    style: "",
    gender: "",
    additionalNotes: "",
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSubmit = async (formData: PreferenceData) => {
    setIsLoading(true);
    setPreferences(formData);

    try {
      const result = await generateOutfitRecommendation(formData);
      setRecommendation(result);
    } catch (error) {
      console.error("Error generating recommendation:", error);
      setRecommendation(
        "Sorry, we couldn't generate recommendations at this time. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Find Your Perfect Outfit
                </h1>
                <p className="text-lg md:text-xl mb-8 text-indigo-100">
                  Get AI-powered outfit recommendations tailored to your style, occasion, and weather.
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <FaMagic className="text-indigo-300" />
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLightbulb className="text-indigo-300" />
                    <span>Style inspiration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaShoppingBag className="text-indigo-300" />
                    <span>Fashion guidance</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src="/fashion-illustration.svg"
                    alt="Fashion Illustration"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Form Section */}
              <div className="w-full md:w-1/2 lg:w-2/5">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <FaLightbulb className="text-indigo-500" />
                    Get Styled
                  </h2>
                  <PreferenceForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
              </div>

              {/* Results Section */}
              <div className="w-full md:w-1/2 lg:w-3/5">
                {recommendation ? (
                  <OutfitRecommendation
                    recommendation={recommendation}
                    preferences={preferences}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 h-full min-h-[400px] border border-gray-100 dark:border-gray-700">
                    <div className="text-center max-w-md">
                      <FaMagic className="mx-auto text-4xl text-indigo-400 mb-4" />
                      <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                        Your Personalized Outfit Awaits
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Fill out the form with your preferences and we'll suggest the perfect outfit for your occasion.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" /> Smart recommendations
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" /> Occasion-based
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" /> Weather-appropriate
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
