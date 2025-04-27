import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, outfitDescription } = await request.json();

    if (!process.env.CONSISTORY_API_KEY) {
      return NextResponse.json(
        { error: "NVIDIA Consistory API key is not configured" },
        { status: 500 }
      );
    }

    // Extract key information from the prompt for better image generation
    const simplePrompt = prompt.toLowerCase(); // e.g. "Women's wearing casual outfit for work"
    
    // Extract details for the consistory model with defaults to avoid empty tokens
    const genderMatch = simplePrompt.match(/(men\'s|women\'s|unisex)/i);
    const gender = genderMatch ? genderMatch[0] : "person";
    
    // Expand the style matching to detect more style types
    const styleMatch = simplePrompt.match(/(casual|formal|business|professional|sporty|elegant|bohemian|streetwear|vintage|smart casual|preppy|minimalist)/i);
    // Important: Provide a default style if none is detected
    const style = styleMatch && styleMatch[0] ? styleMatch[0] : "casual"; 
    
    const occasionMatch = simplePrompt.match(/(work|wedding|party|date|interview|casual outing|meeting|dinner|conference|outdoor|travel)/i);
    const occasion = occasionMatch && occasionMatch[0] ? occasionMatch[0] : "casual";

    // Extract relevant clothing information from the recommendation text
    const clothingDetails = extractClothingDetails(outfitDescription);
    
    console.log("Using consistory model with:", { gender, style, occasion, clothingDetails });

    // Create a non-empty token list - filter out any potentially empty values
    const subjectTokens = [gender, style, "clothes", "outfit", "fashion"].filter(token => token && token.trim() !== "");
    
    if (subjectTokens.length < 2) {
      // Make sure we have at least 2 valid tokens
      subjectTokens.push("outfit", "clothes");
    }

    // Create a more descriptive subject prompt that includes specific clothing items
    const subjectPrompt = `${gender} model wearing ${style} ${clothingDetails.top || ""} ${clothingDetails.bottom || ""} outfit`;

    // Call the NVIDIA consistory model with appropriate parameters
    const response = await fetch("https://ai.api.nvidia.com/v1/genai/nvidia/consistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CONSISTORY_API_KEY}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        mode: "init",
        subject_prompt: subjectPrompt,
        subject_tokens: subjectTokens,
        subject_seed: Math.floor(Math.random() * 1000),
        style_prompt: "Professional fashion photograph of",
        scene_prompt1: `${occasion} setting, full body view of outfit`,
        scene_prompt2: `High quality fashion photography, clear view of ${clothingDetails.top || "top"} and ${clothingDetails.bottom || "bottom"}`,
        negative_prompt: "distorted, unrealistic proportions, blurry, low quality, cartoonish, anime style, extra limbs",
        cfg_scale: 7, // Increased for better prompt adherence
        same_initial_noise: false
      }),
    });

    // Handle response errors
    if (!response.ok) {
      console.error(`NVIDIA API Response Status: ${response.status} ${response.statusText}`);
      
      try {
        const errorData = await response.json();
        console.error("NVIDIA API error response:", errorData);
        return NextResponse.json(
          { error: `API Error: ${errorData.detail || errorData.title || 'Image generation failed'}` },
          { status: 500 }
        );
      } catch (jsonError) {
        console.error("Could not parse error response as JSON:", jsonError);
        return NextResponse.json(
          { error: `Failed to generate image: ${response.status} ${response.statusText}` },
          { status: 500 }
        );
      }
    }

    try {
      const data = await response.json();
      console.log("NVIDIA API success response received");
      
      // Extract base64 image from the artifacts array
      if (data.artifacts && data.artifacts.length > 0) {
        // Debugging the artifact structure
        console.log("Artifact object structure:", Object.keys(data.artifacts[0]));
        
        // Extract the base64 data
        const base64Image = data.artifacts[0].base64;
        
        if (!base64Image) {
          console.error("No base64 data in artifact:", data.artifacts[0]);
          return NextResponse.json(
            { error: "No base64 image data found in response" },
            { status: 500 }
          );
        }
        
        // Convert to a data URL that can be used directly in an <img> tag
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        return NextResponse.json({ imageUrl });
      } else {
        // If no artifacts array, log the response structure
        console.error("Unexpected response structure:", Object.keys(data));
        return NextResponse.json(
          { error: "No artifacts found in API response" },
          { status: 500 }
        );
      }
    } catch (parseError) {
      console.error("Error parsing NVIDIA API response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse image generation response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating outfit image:", error);
    return NextResponse.json(
      {
        error: "Failed to generate outfit image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Extract specific clothing details from the outfit description
 */
function extractClothingDetails(description: string) {
  const details: {
    top?: string;
    bottom?: string;
    outerwear?: string;
    color?: string;
  } = {};

  if (!description) return details;

  // Convert to lowercase for easier matching
  const lowerDesc = description.toLowerCase();

  // Extract color information
  const colorMatches = lowerDesc.match(/(white|black|blue|red|green|yellow|purple|pink|brown|gray|navy|beige|cream|olive|maroon)/g);
  if (colorMatches && colorMatches.length > 0) {
    details.color = colorMatches[0];
  }

  // Extract top information
  if (lowerDesc.includes('shirt')) {
    details.top = 'shirt';
  } else if (lowerDesc.includes('blouse')) {
    details.top = 'blouse';
  } else if (lowerDesc.includes('t-shirt') || lowerDesc.includes('tshirt') || lowerDesc.includes('t shirt')) {
    details.top = 't-shirt';
  } else if (lowerDesc.includes('sweater')) {
    details.top = 'sweater';
  } else if (lowerDesc.includes('hoodie')) {
    details.top = 'hoodie';
  } else if (lowerDesc.includes('tank top')) {
    details.top = 'tank top';
  } else if (lowerDesc.includes('polo')) {
    details.top = 'polo shirt';
  } else if (lowerDesc.includes('top:')) {
    // Extract text after "TOP:" until the end of line
    const topMatch = description.match(/top:\s*([^\n]+)/i);
    if (topMatch && topMatch[1]) {
      details.top = topMatch[1].trim().split(' ').slice(0, 3).join(' ');
    }
  }

  // Extract bottom information
  if (lowerDesc.includes('jeans')) {
    details.bottom = 'jeans';
  } else if (lowerDesc.includes('pants') || lowerDesc.includes('trousers')) {
    details.bottom = 'pants';
  } else if (lowerDesc.includes('shorts')) {
    details.bottom = 'shorts';
  } else if (lowerDesc.includes('skirt')) {
    details.bottom = 'skirt';
  } else if (lowerDesc.includes('dress')) {
    details.bottom = 'dress';
  } else if (lowerDesc.includes('leggings')) {
    details.bottom = 'leggings';
  } else if (lowerDesc.includes('bottom:')) {
    // Extract text after "BOTTOM:" until the end of line
    const bottomMatch = description.match(/bottom:\s*([^\n]+)/i);
    if (bottomMatch && bottomMatch[1]) {
      details.bottom = bottomMatch[1].trim().split(' ').slice(0, 3).join(' ');
    }
  }

  // Extract outerwear information
  if (lowerDesc.includes('jacket')) {
    details.outerwear = 'jacket';
  } else if (lowerDesc.includes('coat')) {
    details.outerwear = 'coat';
  } else if (lowerDesc.includes('blazer')) {
    details.outerwear = 'blazer';
  } else if (lowerDesc.includes('cardigan')) {
    details.outerwear = 'cardigan';
  } else if (lowerDesc.includes('outerwear:')) {
    // Extract text after "OUTERWEAR:" until the end of line
    const outerwearMatch = description.match(/outerwear:\s*([^\n]+)/i);
    if (outerwearMatch && outerwearMatch[1]) {
      details.outerwear = outerwearMatch[1].trim().split(' ').slice(0, 3).join(' ');
    }
  }

  return details;
} 