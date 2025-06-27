const { Catalogue } = require("../../models/Catalogue");
const getAllCatalougeOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const catalogues = await Catalogue.find({ userId });
    if (!catalogues) {
      return res.status(404).json({ message: "Catalogues not found" });
    }

    return res.status(200).json({ catalogues });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllCatalougeOfUser };
