const express = require("express");
const { registerUser, loginUser, googleLogin, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", protect, getProfile);

module.exports = router;
