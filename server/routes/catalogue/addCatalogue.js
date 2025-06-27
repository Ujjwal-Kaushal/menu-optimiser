const express = require("express");
const router = express.Router();

const { addCatalogue } = require("../../controllers/catalogue/addCatalogue");

router.post("/add", addCatalogue);

module.exports = router;
