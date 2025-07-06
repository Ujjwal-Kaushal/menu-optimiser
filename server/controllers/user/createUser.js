// server/controllers/user/createUser.js

const { User } = require("../../models/User");

const createUser = async (req, res) => {
  try {
    const { name, email, authID } = req.body;

    // Check if user already exists based on their Clerk authID
    const existingUser = await User.findOne({ authID });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists in DB." });
    }

    // If user does not exist, create a new one
    const newUser = new User({
      name,
      email,
      authID,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created and synced successfully.", user: newUser });

  } catch (error) {
    console.error("Error creating or syncing user:", error);
    return res.status(500).json({ message: "Server error during user sync." });
  }
};

module.exports = { createUser };