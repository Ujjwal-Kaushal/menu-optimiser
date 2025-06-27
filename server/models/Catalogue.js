const mongoose = require("mongoose");

const CatalogueSchema = mongoose.Schema({
  catalogue_name: { type: String },
  catalogue_description: { type: String },
  imageUrl: [
    {
      image_name: { type: String },
      image_url: { type: String },
    },
  ],
  userId: { type: String },
  ProductDescriptions: { type: Number },
  PricingInformation: { type: Number },
  ProductImages: { type: Number },
  LayoutAndDesign: { type: Number },
  DiscountsAndPromotions: { type: Number },
  BrandConsistency: { type: Number },
  ContactInformationAndCallToAction: { type: Number },
  TyposAndGrammar: { type: Number },
  LegalCompliance: { type: Number },
  areaOfImprovement: { type: String },
  score: { type: String },
  createdOn: { type: Date, default: new Date() },
});

const Catalogue = mongoose.model("Catalogue", CatalogueSchema);
module.exports = { Catalogue };
