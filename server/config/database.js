const mongoose = require("mongoose");

const ConnectToDB = async () => {
  const DATABASE_URL = process.env.DATABASE_URL;
  await mongoose
    .connect(DATABASE_URL)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err) => {
      console.log("ERROR CONNECTING TO DATABASE");
      console.log(err);
    });
};

module.exports = { ConnectToDB };
