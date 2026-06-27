const router = require("express").Router();
const Feedback = require("../models/feedback");

// 📤 Submit feedback
router.post("/", async (req, res) => {
  try {
    const { userName, emailOrPhone, rating, comment } = req.body;

    if (!userName || !emailOrPhone || !comment) {
      return res.status(400).json({ success: false, error: "Name, email/phone, and comments are required." });
    }

    // Check if duplicate feedback exists
    const exists = await Feedback.findOne({ emailOrPhone });
    if (exists) {
      return res.status(400).json({ success: false, error: "You have already submitted feedback once." });
    }

    const newFeedback = new Feedback({
      userName,
      emailOrPhone,
      rating: Number(rating) || 5,
      comment
    });

    await newFeedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: newFeedback
    });
  } catch (error) {
    console.error("Feedback Post Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📥 Fetch all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error("Feedback Fetch Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
