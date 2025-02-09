const mongoose = require("mongoose");
const colors = require("colors");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DATABASE".bgBlue.white);
  } catch (error) {
    console.log(`error connection to DB: ${error}`.bgRed.white);
  }
};

module.exports = connectMongoDB;
