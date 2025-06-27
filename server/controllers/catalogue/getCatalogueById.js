const { Catalogue } = require("../../models/Catalogue");
const getCatalogueById = async (req, res) => {
  try {
    const id = req.params.id;
    const catalogue = await Catalogue.findOne({ _id: id });
    if (!catalogue) {
      return res.status(404).json({ message: "Catalogue not found" });
    }

    return res.status(200).json({ catalogue });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCatalogueById };
