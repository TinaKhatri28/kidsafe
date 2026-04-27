const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createOTP, verifyOTP } = require("../services/otpService");

const USERS = {
  8929105595: {
    role: "parent",
    name: "Gurpreet Singh",
    screen: "ParentHome",
    childName: "Aryan", // ← needed for parent screen
    busNumber: "12", // ← needed for parent screen
  },
  9999999992: {
    role: "driver",
    name: "Rajan Kumar",
    screen: "DriverHome",
    busNumber: "12", // ← needed for driver screen
  },
  9999999993: {
    role: "conductor",
    name: "Ramesh Singh",
    screen: "ConductorHome",
    busNumber: "12", // ← needed for conductor screen
  },
  9999999994: {
    role: "admin",
    name: "Principal Sharma",
    screen: "AdminDashboard",
    school: "DPS Ludhiana", // ← needed for admin screen
  },
};

// POST /api/auth/send-otp
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone || String(phone).length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Enter a valid 10 digit number" });
  }

  if (!USERS[String(phone)]) {
    return res
      .status(404)
      .json({ success: false, message: "Number not registered" });
  }

  await createOTP(String(phone));

  res.json({ success: true, message: "OTP sent successfully" });
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  const result = verifyOTP(String(phone), String(otp));

  if (!result.valid) {
    return res.status(401).json({ success: false, message: result.reason });
  }

  const user = USERS[Number(phone)];

  const token = jwt.sign(
    { phone, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({
    success: true,
    token,
    role: user.screen,
    user: { phone, ...user },
  });
});

module.exports = router;
