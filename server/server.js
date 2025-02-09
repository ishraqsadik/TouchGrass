const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectMongoDB = require("./config/database");

//DOTENV
dotenv.config();

//MONGODB CONNECTION
connectMongoDB();

//REST OBJECT
const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//ROUTES
app.use("/api/v1/auth", require("./routes/user.routes"));
app.use("/api/v1/event", require("./routes/event.routes"));

//PORT
const PORT = process.env.PORT || 8080;

//LISTEN
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgGreen.white);
});
