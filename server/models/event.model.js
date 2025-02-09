const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["public", "private", "invite-only"],
      default: "public",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    location: {
      type: {
        type: String,

        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    details: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    attendees: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    invitees: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);


EventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
