const { User } = require("../../models/User");

const getUserByEmail = async (req, res) => {
  try {
    const email = await req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: " User found", data: user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUserByEmail };
