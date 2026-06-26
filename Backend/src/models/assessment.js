const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      default: "en"
    },

    age: Number,

    gender: String,

    symptom: String,

    currentStage: {
      type: Number,
      default: 1
    },

    stage1Answers: {
      type: Object,
      default: {}
    },

    stage2Answers: {
      type: Object,
      default: {}
    },

    stage3Answers: {
      type: Object,
      default: {}
    },

    riskScore: {
      type: Number,
      default: 0
    },

    riskLevel: {
      type: String,
      default: "LOW"
    },

    summary: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Assessment",
  assessmentSchema
);