const router = require("express").Router();
const User = require("../models/user");

// 📊 Get user count
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📝 Registration
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, pincode, age, gender, location, language, latitude, longitude } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, error: "Name, phone, and password are required." });
    }

    // Check if phone already registered
    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return res.status(400).json({ success: false, error: "A user with this phone number already exists." });
    }

    // Check if email already registered (if email is provided)
    if (email) {
      const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
      if (existingEmailUser) {
        return res.status(400).json({ success: false, error: "A user with this email address already exists." });
      }
    }

    const newUser = new User({
      name,
      phone,
      email: email ? email.toLowerCase() : undefined,
      password,
      pincode,
      age: Number(age) || undefined,
      gender,
      location,
      language: language || "English",
      latitude,
      longitude
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔑 Login
router.post("/login", async (req, res) => {
  try {
    const { loginEmail, loginPassword } = req.body;

    if (!loginEmail || !loginPassword) {
      return res.status(400).json({ success: false, error: "Email/Phone and password are required." });
    }

    // Search by email or phone
    const user = await User.findOne({
      $or: [
        { email: loginEmail.toLowerCase() },
        { phone: loginEmail }
      ]
    });

    if (!user || user.password !== loginPassword) {
      return res.status(400).json({ success: false, error: "Invalid credentials." });
    }

    res.json({
      success: true,
      message: "Login successful",
      user
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔄 Update user data (sync from frontend)
router.put("/update", async (req, res) => {
  try {
    const { userId, updates } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required for updates." });
    }

    // Prevent direct password modification here unless explicitly desired (keep simple for sync)
    const allowedUpdates = { ...updates };
    delete allowedUpdates._id;
    delete allowedUpdates.id;

    if (allowedUpdates.email) {
      allowedUpdates.email = allowedUpdates.email.toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: allowedUpdates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({
      success: true,
      message: "User profile updated and synchronized",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 Get user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
