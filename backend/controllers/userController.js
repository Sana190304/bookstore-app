const User = require("../models/User");

// @route POST /api/users/wishlist/:bookId
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookId = req.params.bookId;

    const alreadyExists = user.wishlist.some((id) => id.toString() === bookId);

    if (alreadyExists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
    } else {
      user.wishlist.push(bookId);
    }

    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/users/wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleWishlist, getWishlist };
