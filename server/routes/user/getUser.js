const express = require("express");
const router = express.Router();
const { getUserByEmail } = require("../../controllers/user/getUserByEmail");

router.get("/user/:email", getUserByEmail);

module.exports = router;
