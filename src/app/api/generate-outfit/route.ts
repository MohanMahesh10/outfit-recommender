import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
// Update to use the latest model name
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function POST(request: NextRequest) {
  try {
    const { occasion, weather, style, gender, additionalNotes } = await request.json();

    // Validate required fields
    if (!occasion || !weather || !style || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a professional fashion stylist. Please recommend a complete outfit based on the following:
      
      - Occasion: ${occasion}
      - Weather: ${weather}
      - Preferred style: ${style}
      - Gender: ${gender}
      ${additionalNotes ? `- Additional notes: ${additionalNotes}` : ''}
      
      Provide a CONCISE outfit recommendation (max 200 words) in this structured format:
      
      TOP: [describe top item]
      BOTTOM: [describe bottom item]
      OUTERWEAR: [if needed for weather]
      SHOES: [describe shoes]
      ACCESSORIES: [1-2 key accessories]
      
      Be specific and practical. Mention colors and materials but keep it brief.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ recommendation: text });
  } catch (error) {
    console.error("Error generating outfit recommendation:", error);
    return NextResponse.json(
      {
        error: "Failed to generate outfit recommendation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 