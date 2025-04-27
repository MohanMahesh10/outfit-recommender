/**
 * Generate outfit recommendations based on user preferences
 * @param preferences User's style preferences, occasion, weather, etc.
 * @returns Outfit recommendations from Gemini
 */
export async function generateOutfitRecommendation(preferences: {
  occasion: string;
  weather: string;
  style: string;
  gender: string;
  additionalNotes?: string;
}) {
  try {
    const response = await fetch('/api/generate-outfit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate outfit recommendation');
    }

    const data = await response.json();
    return data.recommendation;
  } catch (error) {
    console.error("Error generating outfit recommendation:", error);
    return "Sorry, I couldn't generate an outfit recommendation at this time. Please try again later.";
  }
} 