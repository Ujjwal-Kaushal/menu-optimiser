const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// const IMAGES = [
//   {
//     type: "image_url",
//     image_url: {
//       url: "https://res.cloudinary.com/df3lxtjcl/image/upload/v1706621084/hqnz3aiowtfopakxlgc7.jpg",
//     },
//   },
//   {
//     type: "image_url",
//     image_url: {
//       url: "https://res.cloudinary.com/df3lxtjcl/image/upload/v1706621074/zeokmnmqw67qk3l4wuy2.jpg",
//     },
//   },
// ];

async function scanCatalogueWithAI({ images }) {
  let IMAGES = [];
  images.forEach((x) => {
    // console.log(x);
    IMAGES.push({
      type: "image_url",
      image_url: {
        url: x.image_url,
      },
    });
  });

  // console.log(IMAGES);

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are a system that always extracts information from an image in just a json_format",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Catalog Scoring Mechanism Parameters: Product Descriptions, Pricing Information, Product Images,Layout and Design, Discounts and Promotions, Brand Consistency, Contact Information and Call-to-Action,Typos and Grammar,Legal Compliance, AreaOfImprovement. Following image urls are the images of a catalogue and now use this mechanism and apply it to this catalogue and score this catalogue between 0 and 100 in first 9 parameters, provide just the scores for each property and provide a helpful message for the 'AreaOfImprovement' parameter. Provide a single set of scores because the images belong to a single catalogue. If any of the images does not seem to be of a catalogue, just provide the message in the areaOfImprovement and give 0 to rest of the scores, but don't do this for unclear, or incomplete catalogues. The images also may not be a complete catalogue, just provide the scores based on the availability.",
          },
          ...IMAGES,
          //   {
          //     type: "image_url",
          //     image_url: {
          //       url: "https://res.cloudinary.com/df3lxtjcl/image/upload/v1706621084/hqnz3aiowtfopakxlgc7.jpg",
          //     },
          //   },
          //   {
          //     type: "image_url",
          //     image_url: {
          //       url: "https://res.cloudinary.com/df3lxtjcl/image/upload/v1706621074/zeokmnmqw67qk3l4wuy2.jpg",
          //     },
          //   },
        ],
      },
    ],
    max_tokens: 200,
  });

  let result = response.choices[0].message.content;
  console.log(result);

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "user",
        content:
          "Extract the properties from this object" +
          result +
          "and based upon that call createResponseObject function.",
      },
    ],
    functions: [
      {
        name: "createResponseObject",
        parameters: {
          type: "object",
          properties: {
            ProductDescriptions: {
              type: "integer",
            },
            PricingInformation: {
              type: "integer",
            },
            ProductImages: {
              type: "integer",
            },
            LayoutAndDesign: {
              type: "integer",
            },
            DiscountsAndPromotions: {
              type: "integer",
            },
            BrandConsistency: {
              type: "integer",
            },
            ContactInformationAndCallToAction: {
              type: "integer",
            },
            TyposAndGrammar: {
              type: "integer",
            },
            LegalCompliance: {
              type: "integer",
            },
            areaOfImprovement: {
              type: "string",
            },
          },
          required: [
            "ProductDescriptions",
            "PricingInformation",
            "ProductImages",
            "LayoutAndDesign",
            "DiscountsAndPromotions",
            "BrandConsistency",
            "ContactInformationAndCallToAction",
            "TyposAndGrammar",
            "LegalCompliance",
          ],
        },
      },
    ],
    function_call: { name: "createResponseObject" },
  });

  const functionCall = gptResponse.choices[0].message.function_call;
  const json = JSON.parse(functionCall.arguments);

  console.log(json);
  return json;
  // return images;
}
module.exports = { scanCatalogueWithAI };
