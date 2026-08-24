const express = require("express");
const { toggleWishlist, getWishlist } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:bookId", protect, toggleWishlist);

module.exports = router;
