// const { response } = require("../../data/placeholder");
const { Catalogue } = require("../../models/Catalogue");
const { scanCatalogueWithAI } = require("../../services/vision");
const addCatalogue = async (req, res) => {
  try {
    const { catalogue_name, catalogue_description, images, userId } = req.body;

    let responseAI = {};

    const existingCatalogue = await Catalogue.findOne({ catalogue_name });

    if (existingCatalogue != null) {
      responseAI = await scanCatalogueWithAI({ images });

      const newCatalogue = await Catalogue.findOneAndUpdate(
        { _id: existingCatalogue._id },
        {
          $set: {
            ...responseAI,
            imageUrl: [...images],
          },
        },
        { new: true }
      );

      res.status(200).json({
        message: "Catalogue updated successfully",
        catalogue: newCatalogue,
      });
    } else {
      responseAI = await scanCatalogueWithAI({ images });

      let score =
        0.2 * responseAI.ProductDescriptions +
        0.2 * responseAI.PricingInformation +
        0.15 * responseAI.ProductImages +
        0.1 * responseAI.LayoutAndDesign +
        0.1 * responseAI.DiscountsAndPromotions +
        0.1 * responseAI.BrandConsistency +
        0.05 * responseAI.ContactInformationAndCallToAction +
        0.05 * responseAI.TyposAndGrammar +
        0.05 * responseAI.LegalCompliance;

      const catalogue = await new Catalogue({
        catalogue_name,
        catalogue_description,
        userId,
        ...responseAI,
        imageUrl: [...images],
        score,
      });

      await catalogue.save();

      res
        .status(200)
        .json({ message: "Catalogue saved to DB successfully", catalogue });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving catalogue" });
  }
};

module.exports = { addCatalogue };
