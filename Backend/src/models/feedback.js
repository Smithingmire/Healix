const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    emailOrPhone: {
      type: String,
      required: true,
      unique: true
    },
    rating: {
      type: Number,
      default: 5
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString()
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
