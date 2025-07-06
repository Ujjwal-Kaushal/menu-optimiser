// server/routes/user.js

const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/user/createUser");

// POST /user/create
router.post("/create", createUser);

module.exports = router;