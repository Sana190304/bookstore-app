import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const categoryStyle = {
  Fiction: "bg-amber-100 text-amber-800",
  "Non-fiction": "bg-stone-200 text-stone-700",
  Academic: "bg-amber-200 text-amber-900",
};

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/books/${id}`).then(({ data }) => setBook(data));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api.get("/users/wishlist").then(({ data }) => {
      setIsWishlisted(data.some((b) => b._id === id));
    });
  }, [id, user]);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleWishlist = async () => {
    setIsWishlisted((prev) => !prev); // optimistic update
    try {
      await api.post(`/users/wishlist/${id}`);
    } catch {
      setIsWishlisted((prev) => !prev); // revert on failure
    }
  };

  if (!book) return <p className="text-center py-24 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-amber-700 text-sm hover:underline inline-block mb-6">
        ← Back to Books
      </Link>

      <div className="bg-white border border-amber-100 rounded-2xl shadow-xl shadow-amber-900/5 ring-1 ring-black/5 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-80 sm:h-96 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 rounded-xl shadow-inner flex items-center justify-center text-7xl overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-contain drop-shadow-lg"
            />
          ) : (
            "📖"
          )}
        </div>

        <div className="flex flex-col">
          <span
            className={`inline-block self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${
              categoryStyle[book.category] || "bg-gray-100 text-gray-700"
            }`}
          >
            {book.category}
          </span>

          <h1 className="font-display text-3xl mb-1">{book.title}</h1>
          <p className="text-gray-500">by {book.author}</p>

          {book.rating > 0 && (
            <p className="text-amber-500 mt-2">
              {"★".repeat(Math.round(book.rating))}
              {"☆".repeat(5 - Math.round(book.rating))}{" "}
              <span className="text-gray-400 text-sm">({book.rating})</span>
            </p>
          )}

          <p className="text-gray-600 mt-4 leading-relaxed">{book.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-amber-700">₹{book.price}</span>
            <span
              className={`text-sm ${book.stock > 0 ? "text-amber-700" : "text-red-500"}`}
            >
              {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center border rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="flex-1 sm:flex-none whitespace-nowrap bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:from-gray-300 disabled:to-gray-300 disabled:hover:scale-100"
            >
              {added ? "Added!" : "Add to cart"}
            </button>

            {user && (
              <button
                onClick={toggleWishlist}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-colors ${
                  isWishlisted
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{isWishlisted ? "❤️" : "♡"}</span>
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
