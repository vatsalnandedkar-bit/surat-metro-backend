const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();


// =====================================================
// REGISTER USER
// =====================================================

router.post("/register", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Check required fields
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        message: "Email/Phone and Password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      emailOrPhone: emailOrPhone,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create new user
    const newUser = new User({
      emailOrPhone: emailOrPhone,
      password: hashedPassword,
    });

    // Save user in MongoDB
    await newUser.save();

    res.status(201).json({
      message: "Registered User Successfully!",
    });

  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});


// =====================================================
// LOGIN USER
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Check required fields
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        message: "Email/Phone and Password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      emailOrPhone: emailOrPhone,
    });

    // User not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid Email/Phone or Password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Password incorrect
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid Email/Phone or Password",
      });
    }

    // Login successful
    res.status(200).json({
      message: "Login Successful",

      user: {
        id: user._id,
        emailOrPhone: user.emailOrPhone,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});


module.exports = router;