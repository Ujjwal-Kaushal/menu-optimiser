// server/controllers/catalogue/addCatalogue.js (Final Corrected Version)

const { Catalogue } = require("../../models/Catalogue");
// --- THE ONLY FIX NEEDED IS ON THIS LINE: REMOVED THE CURLY BRACES ---
const {scanCatalogueWithAI} = require("../../services/vision");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// --- Configure Cloudinary ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const addCatalogue = async (req, res) => {
  try {
    // --- Step 1: Handle the file upload from the request ---
    if (!req.file) {
      return res.status(400).json({ message: 'No image file was uploaded.' });
    }

    // --- Step 2: Upload image to Cloudinary ---
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cloudinaryUpload = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
    });

    // --- Step 3: Prepare data and call the AI service ---
    const image_url = cloudinaryUpload.secure_url;
    const image_name = req.file.originalname;
    const { catalogue_name, catalogue_description, userId } = req.body;
    const images = [{ image_name, image_url }];
    
    // This call will now work because scanCatalogueWithAI is a function
    const responseAI = await scanCatalogueWithAI({ images });

    // Defensive check for the AI response
    if (!responseAI || typeof responseAI.ProductDescriptions === 'undefined') {
      console.error("FAIL: Invalid or empty response from AI service.", responseAI);
      return res.status(500).json({ message: "Failed to get a valid response from the AI scanning service." });
    }

    // --- Step 4: Calculate Score ---
    const score = (
        0.2 * responseAI.ProductDescriptions +
        0.2 * responseAI.PricingInformation +
        0.15 * responseAI.ProductImages +
        0.1 * responseAI.LayoutAndDesign +
        0.1 * responseAI.DiscountsAndPromotions +
        0.1 * responseAI.BrandConsistency +
        0.05 * responseAI.ContactInformationAndCallToAction +
        0.05 * responseAI.TyposAndGrammar +
        0.05 * responseAI.LegalCompliance
    ) / 100;

    // --- Step 5: Save or Update the document in the database ---
    const existingCatalogue = await Catalogue.findOne({ catalogue_name, userId });

    if (existingCatalogue) {
      const updatedCatalogue = await Catalogue.findOneAndUpdate(
        { _id: existingCatalogue._id },
        {
          $set: {
            ...responseAI,
            images,
            catalogue_description,
            score,
          },
        },
        { new: true }
      );
      return res.status(200).json({ message: "Catalogue updated successfully", catalogue: updatedCatalogue });
    } else {
      const newCatalogue = new Catalogue({
        catalogue_name,
        catalogue_description,
        userId,
        ...responseAI,
        images,
        score,
      });
      await newCatalogue.save();
      return res.status(200).json({ message: "Catalogue saved and scanned successfully", catalogue: newCatalogue });
    }
  } catch (error) {
    console.error("\n--- ERROR IN addCatalogue CONTROLLER ---");
    console.error("The process failed. See the detailed error below:");
    console.error(error);
    console.error("--- END OF ERROR ---");
    res.status(500).json({ message: "An internal server error occurred. Check server logs for details." });
  }
};

module.exports = { addCatalogue };