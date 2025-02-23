const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the full name"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Please enter the username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter the email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Please enter the phone"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
      min: 6,
      max: 64,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    connections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    requestedConnections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    interests: {
      type: [String],
      default: [],
    },
    attendedEvents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Event",
    },
  },
  {
    timestamps: true,
  }

);

const User = mongoose.model("User", userSchema);

module.exports = User;
