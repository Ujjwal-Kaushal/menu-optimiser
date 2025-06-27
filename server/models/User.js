const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  authID: { type: String },
  createdOn: { type: Date, default: new Date() },
});

const User = mongoose.model("Users", userSchema);
module.exports = { User };
