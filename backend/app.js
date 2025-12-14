// Imports
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { PORT } = require(path.join(__dirname, "constants"));
const { connectToMongo } = require(path.join(__dirname, "dbConnect"));
const cors = require("cors");
// Configuring dotenv
dotenv.config({ path: path.join(__dirname, ".env") });

// Configuring express
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All Routes
const authRouter = require(path.join(
  __dirname,
  "routes",
  "authRouter",
  "authRouter"
));
const documentRouter = require(path.join(
  __dirname,
  "routes",
  "documentRouter",
  "documentRouter"
));

// Connecting mongo DB
connectToMongo();

// Using Router
app.use("/auth", authRouter);
app.use("/document", documentRouter);

// Listening app to the port
app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
