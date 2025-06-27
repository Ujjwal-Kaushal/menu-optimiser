const express = require("express");
const router = express.Router();
const { createUserController } = require("../../controllers/user/createUser");

router.post("/user/create", createUserController);

module.exports = router;
