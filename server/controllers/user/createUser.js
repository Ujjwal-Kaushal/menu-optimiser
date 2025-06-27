const { User } = require("../../models/User");
const bcrypt = require("bcryptjs");

const createUserController = async (req, res) => {
  try {
    const { name, email, authID } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists in database",
        data: existingUser,
      });
    }

    const newUser = await new User({
      name,
      email,
      authID,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User added to database", data: newUser });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUserController };
