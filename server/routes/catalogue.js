// server/routes/catalogue.js

const express = require("express");
const router = express.Router();
const multer = require("multer");

// --- Import all necessary controllers ---
const { addCatalogue } = require("../controllers/catalogue/addCatalogue");
const { getAllCatalougeOfUser } = require("../controllers/catalogue/getAllCatalogueOfUser");
const { getCatalogueById } = require("../controllers/catalogue/getCatalogueById");

// --- Configure Multer for file uploads ---
// It's defined here because it's only needed for the /add route.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Define All Catalogue-Related Routes ---

// POST /catalogue/add
// The multer middleware `upload.single('image')` is applied ONLY to this route.
router.post("/add", upload.single("image"), addCatalogue);

// GET /catalogue/all/:userId
router.get("/all/:userId", getAllCatalougeOfUser);

// GET /catalogue/vision/:id
router.get("/vision/:id", getCatalogueById);

// --- Export the consolidated router ---
module.exports = router;