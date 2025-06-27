const express = require("express");
const router = express.Router();

const {
  getCatalogueById,
} = require("../../controllers/catalogue/getCatalogueById");

router.get("/vision/:id", getCatalogueById);

module.exports = router;
