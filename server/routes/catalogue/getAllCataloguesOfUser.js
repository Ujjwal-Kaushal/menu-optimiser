const express = require("express");
const router = express.Router();
const {
  getAllCatalougeOfUser,
} = require("../../controllers/catalogue/getAllCatalogueOfUser");

router.get("/all/:userId", getAllCatalougeOfUser);

module.exports = router;
