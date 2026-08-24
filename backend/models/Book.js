const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // Fiction, Non-fiction, Academic, etc.
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    coverImage: { type: String }, // Cloudinary URL
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
