require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ConnectToDB } = require("./config/database");
const PORT = process.env.PORT | 3000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Home route working " });
});

app.use("/", require("./routes/user/createUser"));
app.use("/", require("./routes/user/getUser"));
app.use("/catalogue", require("./routes/catalogue/getCatalogue"));
app.use("/catalogue", require("./routes/catalogue/addCatalogue"));
app.use("/catalogue", require("./routes/catalogue/getAllCataloguesOfUser"));

const startServer = async () => {
  await ConnectToDB();
  app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
  });
};

startServer();
