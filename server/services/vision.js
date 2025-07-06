// // module.exports = { scanCatalogueWithAI };

// // --- THE ONLY FIX IS ON THIS LINE ---
// const { Ollama } = require('ollama');
// const axios = require('axios');
// require('dotenv').config();

// // Initialize Ollama Client
// const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

// // --- THIS IS THE NEW GENERALIZED PROMPT ---
// // It provides a 'rubric' for scoring, not a hardcoded answer.
// // This forces the AI to analyze the image and make its own decisions.
// const catalogueAnalysisPrompt = `
// ROLE: You are an expert marketing and design analyst.

// TASK: Analyze the provided image of a product catalogue page and score it from 0 to 100 on the following criteria. Your analysis must be strict, objective, and based ONLY on the visual information present in the image.

// CRITICAL INSTRUCTION: If a specific category of information (e.g., pricing, detailed product descriptions, legal disclaimers) is COMPLETELY ABSENT from the image, you MUST assign it a score of 0. Do not assume information exists on other pages. Score only what you see.

// SCORING CRITERIA (THE RUBRIC):
// 1.  ProductDescriptions:
//     - 100: Detailed, persuasive descriptions are present, highlighting benefits and features for specific products.
//     - 50: Basic descriptions are present (e.g., just product names or short phrases).
//     - 0: No product descriptions are visible at all.

// 2.  PricingInformation:
//     - 100: Clear, easy-to-find prices for visible products.
//     - 50: Prices are mentioned but are hard to find, unclear, or incomplete.
//     - 0: Absolutely no pricing information is visible in the image.

// 3.  ProductImages:
//     - 100: High-quality, professional, and appealing images that clearly show the products.
//     - 50: Images are low-resolution, poorly lit, or do not clearly represent the product.
//     - 0: No product images are present.

// 4.  LayoutAndDesign:
//     - 100: The layout is clean, professional, well-organized, and visually appealing. Good use of whitespace and hierarchy.
//     - 50: The layout is cluttered, confusing, or looks unprofessional.
//     - 0: The page is a chaotic mess of text and images with no clear structure.

// 5.  DiscountsAndPromotions:
//     - 100: Special offers, discounts, or promotions are clearly highlighted and easy to understand.
//     - 50: Promotions are mentioned but are not prominent or are confusing.
//     - 0: No discounts or promotions are visible in the image.

// 6.  BrandConsistency:
//     - 100: The catalogue consistently uses the brand's logos, color scheme, and typography.
//     - 50: Some branding elements are present but are used inconsistently.
//     - 0: No clear branding is visible.

// 7.  ContactInformationAndCallToAction:
//     - 100: Clear contact information (website, phone, address) AND a strong call to action (e.g., "Shop Now," "Visit our Website") are present.
//     - 50: Contact info OR a call to action is present, but not both, or they are hard to find.
//     - 0: No contact information or call to action is visible.

// 8.  TyposAndGrammar:
//     - 100: All visible text is free of any spelling or grammatical errors.
//     - 50: There are one or two minor, barely noticeable errors.
//     - 0: The text has significant and noticeable errors that reduce credibility.

// 9.  LegalCompliance:
//     - 100: Necessary legal text (e.g., terms and conditions, copyright notice with a year) is present and legible.
//     - 50: Legal text is present but very hard to read (e.g., tiny font) or is incomplete.
//     - 0: No legal disclaimers or copyright information is visible.

// OUTPUT FORMAT: You MUST respond with ONLY a valid JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json. The JSON object should have the following structure. Generate the 'AreasOfImprovement' string based on the lowest scores you assign.

// {
//   "ProductDescriptions": <score>,
//   "PricingInformation": <score>,
//   "ProductImages": <score>,
//   "LayoutAndDesign": <score>,
//   "DiscountsAndPromotions": <score>,
//   "BrandConsistency": <score>,
//   "ContactInformationAndCallToAction": <score>,
//   "TyposAndGrammar": <score>,
//   "LegalCompliance": <score>,
//   "AreasOfImprovement": "<A brief, comma-separated list of the top areas with the lowest scores>"
// }
// `;


// async function urlToBase64(url) {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     return Buffer.from(response.data, 'binary').toString('base64');
// }

// const scanCatalogueWithAI = async ({ images }) => {
//     try {
//         console.log("INFO: Starting Ollama catalogue scan with dynamic rubric...");
        
//         if (!images || images.length === 0) {
//             throw new Error("No images were provided for scanning.");
//         }

//         const imageAsBase64 = await urlToBase64(images[0].image_url);

//         const response = await ollama.generate({
//             model: "llava",
//             prompt: catalogueAnalysisPrompt,
//             images: [imageAsBase64],
//             format: "json",
//             stream: false,
//         });

//         console.log("INFO: Raw AI Response:", response.response);

//         const parsedResponse = JSON.parse(response.response);
//         console.log("INFO: Parsed AI Response:", parsedResponse);
        
//         return parsedResponse;

//     } catch (error) {
//         console.error("--- ERROR IN vision.js (scanCatalogueWithAI with Ollama) ---");
//         console.error("Failed to scan catalogue. Check if Ollama server is running and the model can handle the prompt.", error);
//         throw new Error("AI Service (Ollama) failed to process the image.");
//     }
// };

// module.exports = { scanCatalogueWithAI };

const { Ollama } = require('ollama');
const axios = require('axios');
require('dotenv').config();

// Initialize Ollama Client
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

// --- THE NEW, HYPER-CRITICAL AND GRANULAR PROMPT ---
// This version uses a multi-step rubric to force more nuanced analysis.
const catalogueAnalysisPrompt = `
ROLE: You are a hyper-critical and meticulous marketing analyst. Your analysis must be unforgivingly objective and based STRICTLY on the content of the provided image.

MOST IMPORTANT RULE OF ALL: If an entire category of information is COMPLETELY ABSENT from the image, you MUST assign it a score of 0. This is not optional. For example, if there is no price tag anywhere, 'PricingInformation' MUST be 0. If there is no website, phone number, or "Shop Now" button, 'ContactInformationAndCallToAction' MUST be 0. Do not be generous.

TASK: Score the catalogue page using the detailed multi-step rubric below. Find the description that BEST matches the image for each category and assign the corresponding score.

GRANULAR SCORING RUBRIC:
1.  ProductDescriptions:
    - Score 0: Absolutely no text describing products.
    - Score 25: Only high-level category names are present (e.g., "Home Tech," "Entertainment Products").
    - Score 50: Basic product names are listed with a very short, unpersuasive tagline.
    - Score 75: Good descriptions are present but might be too short, lack persuasive language, or miss key benefits.
    - Score 100: Detailed, compelling descriptions are present for specific products, highlighting features AND benefits.

2.  PricingInformation:
    - Score 0: Absolutely no pricing information is visible.
    - Score 40: Prices might be hinted at or are extremely hard to find or unclear.
    - Score 80: Prices are clearly visible for some, but not all, of the featured products.
    - Score 100: Prices are clear, prominent, and easy to associate with every featured product.

3.  ProductImages:
    - Score 0: No product images are present.
    - Score 40: Images are low resolution, blurry, poorly lit, or cluttered.
    - Score 80: Images are good quality but could be more appealing or better integrated into the design.
    - Score 100: Images are high-quality, professional, visually appealing, and clearly showcase the products in a compelling way.

4.  LayoutAndDesign:
    - Score 0: The page is a chaotic mess with no clear structure.
    - Score 40: The layout is functional but cluttered, unbalanced, or unprofessional.
    - Score 80: The layout is clean and professional but could be more visually engaging or creative.
    - Score 100: The layout is exceptional: professional, well-organized, visually appealing, with excellent use of whitespace, hierarchy, and color theory.

5.  DiscountsAndPromotions:
    - Score 0: No discounts, sales, or special offers are visible.
    - Score 50: A promotion is mentioned but is not prominent, is confusing, or lacks a clear call to action.
    - Score 100: Special offers or discounts are clearly highlighted, easy to understand, and create a sense of urgency.

6.  BrandConsistency:
    - Score 0: No clear branding is visible.
    - Score 50: Some branding elements (logo, colors) are present but are used inconsistently or weakly.
    - Score 100: The catalogue consistently and effectively uses the brand's logos, color scheme, and typography.

7.  ContactInformationAndCallToAction (CTA):
    - Score 0: Absolutely no contact information (website, phone, address) or CTA is visible.
    - Score 30: Only a brand name is present, with no way to act.
    - Score 60: EITHER contact info OR a CTA ("Shop Now") is present, but not both.
    - Score 100: Both clear contact information AND a strong, visible call to action are present.

8.  TyposAndGrammar:
    - Score 0: The text has significant and noticeable errors that reduce credibility.
    - Score 50: There are one or two minor, barely noticeable errors.
    - Score 100: All visible text is flawless and free of any spelling or grammatical errors.

9.  LegalCompliance:
    - Score 0: No legal disclaimers, terms, or copyright information is visible.
    - Score 50: Legal text is present but is incomplete or nearly illegible (e.g., extremely tiny font).
    - Score 100: Necessary legal text (e.g., copyright notice with year, terms) is present and fully legible.

OUTPUT FORMAT: You MUST respond with ONLY a valid JSON object. Generate the 'AreasOfImprovement' string based on the categories that score below 75.

{
  "ProductDescriptions": <score>,
  "PricingInformation": <score>,
  "ProductImages": <score>,
  "LayoutAndDesign": <score>,
  "DiscountsAndPromotions": <score>,
  "BrandConsistency": <score>,
  "ContactInformationAndCallToAction": <score>,
  "TyposAndGrammar": <score>,
  "LegalCompliance": <score>,
  "AreasOfImprovement": "<A brief, comma-separated list of the top areas with scores below 75>"
}
`;


async function urlToBase64(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
}

const scanCatalogueWithAI = async ({ images }) => {
    try {
        console.log("INFO: Starting Ollama catalogue scan with HYPER-CRITICAL rubric...");
        
        if (!images || images.length === 0) {
            throw new Error("No images were provided for scanning.");
        }

        const imageAsBase64 = await urlToBase64(images[0].image_url);

        const response = await ollama.generate({
            model: "llava",
            prompt: catalogueAnalysisPrompt,
            images: [imageAsBase64],
            format: "json",
            stream: false,
        });

        console.log("INFO: Raw AI Response:", response.response);

        const parsedResponse = JSON.parse(response.response);
        console.log("INFO: Parsed AI Response:", parsedResponse);
        
        return parsedResponse;

    } catch (error) {
        console.error("--- ERROR IN vision.js (scanCatalogueWithAI with Ollama) ---");
        console.error("Failed to scan catalogue. Check if Ollama server is running and the model can handle the prompt.", error);
        throw new Error("AI Service (Ollama) failed to process the image.");
    }
};

module.exports = { scanCatalogueWithAI };