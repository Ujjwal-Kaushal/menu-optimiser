// server/services/vision.js (REPLACED WITH LLAVA)

const Replicate = require("replicate");
require("dotenv").config();

// Initialize the Replicate client with your API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// This is a carefully engineered prompt to force the AI to return clean JSON.
const createPrompt = () => {
  return `Analyze the provided catalogue image. Your task is to score it on several parameters.
  Respond with ONLY a valid JSON object, and nothing else. Do not add any text before or after the JSON.
  The JSON object must have these exact keys: "ProductDescriptions", "PricingInformation", "ProductImages", "LayoutAndDesign", "DiscountsAndPromotions", "BrandConsistency", "ContactInformationAndCallToAction", "TyposAndGrammar", "LegalCompliance", and "areaOfImprovement".
  
  For the first 9 keys, provide an integer score between 0 and 100.
  - If a category is excellent, score it high (e.g., 95).
  - If a category is missing (e.g., no prices are visible), score it 0.
  - If a category is poor, score it low.
  
  For the "areaOfImprovement" key, provide a concise string (2-3 sentences) suggesting how to make the catalogue better. Base your suggestions on the lowest scores.
  
  Example of the required output format:
  {
    "ProductDescriptions": 85,
    "PricingInformation": 0,
    "ProductImages": 90,
    "LayoutAndDesign": 75,
    "DiscountsAndPromotions": 20,
    "BrandConsistency": 95,
    "ContactInformationAndCallToAction": 50,
    "TyposAndGrammar": 98,
    "LegalCompliance": 70,
    "areaOfImprovement": "The catalogue lacks clear pricing information. Adding prices and a stronger call-to-action would significantly improve its effectiveness."
  }
  
  Now, analyze the image I provide.`;
};

async function scanCatalogueWithAI({ images }) {
  if (!images || images.length === 0) {
    throw new Error("No images provided for scanning.");
  }

  // LLaVA processes one image at a time. We'll use the first uploaded image.
  const primaryImageUrl = images[0].image_url;
  const prompt = createPrompt();

  console.log("Sending image to LLaVA model for analysis...");

  try {
    const output = await replicate.run(
      // This is the specific identifier for the LLaVA-13B model on Replicate
      "yorickvp/llava-13b:e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358",
      {
        input: {
          image: primaryImageUrl,
          prompt: prompt,
          max_tokens: 1024, // Allow enough space for the JSON response
          temperature: 0.2, // Lower temperature makes the output more predictable and less random
        },
      }
    );

    // The model output is an array of strings; we join them into a single string.
    const resultString = output.join("").trim();
    console.log("Raw response from LLaVA:", resultString);

    // Attempt to parse the string as JSON.
    const jsonResult = JSON.parse(resultString);
    console.log("Successfully parsed JSON from LLaVA:", jsonResult);

    // --- IMPORTANT: Validate the JSON to prevent errors later ---
    const requiredKeys = ["ProductDescriptions", "PricingInformation", "ProductImages", "LayoutAndDesign", "DiscountsAndPromotions", "BrandConsistency", "ContactInformationAndCallToAction", "TyposAndGrammar", "LegalCompliance"];
    for (const key of requiredKeys) {
      if (typeof jsonResult[key] !== 'number') {
        console.warn(`LLaVA returned an invalid or missing value for ${key}. Defaulting to 0.`);
        jsonResult[key] = 0; // Provide a safe default if a score is missing or not a number
      }
    }
    if (typeof jsonResult.areaOfImprovement !== 'string') {
        jsonResult.areaOfImprovement = "The AI model could not provide a suggestion for improvement.";
    }

    return jsonResult;

  } catch (error) {
    console.error("Error processing with LLaVA or parsing its response:", error);
    // Return a default error object if the AI fails, preventing the app from crashing.
    return {
      ProductDescriptions: 0,
      PricingInformation: 0,
      ProductImages: 0,
      LayoutAndDesign: 0,
      DiscountsAndPromotions: 0,
      BrandConsistency: 0,
      ContactInformationAndCallToAction: 0,
      TyposAndGrammar: 0,
      LegalCompliance: 0,
      areaOfImprovement: "There was an error processing the catalogue with the AI model. The AI may have returned an invalid format. Please try again.",
    };
  }
}

module.exports = { scanCatalogueWithAI };