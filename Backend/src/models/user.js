const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      required: true
    },
    pincode: String,
    age: Number,
    gender: String,
    location: String,
    language: {
      type: String,
      default: "English"
    },
    latitude: Number,
    longitude: Number,
    pastDiseases: {
      type: Array,
      default: []
    },
    medicalReports: {
      type: Array,
      default: []
    },
    medications: {
      type: Array,
      default: []
    },
    coreVitals: {
      bloodGroup: { type: String, default: "" },
      allergies: { type: String, default: "" },
      height: { type: String, default: "" },
      weight: { type: String, default: "" },
      chronicConditions: { type: String, default: "" }
    },
    chatSessions: {
      type: Array,
      default: []
    },
    activeSessionId: {
      type: String,
      default: null
    },
    misinfoHistory: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
