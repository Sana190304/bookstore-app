import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const categoryStyle = {
  Fiction: "bg-amber-100 text-amber-800",
  "Non-fiction": "bg-stone-200 text-stone-700",
  Academic: "bg-amber-200 text-amber-900",
};

export default function BookCard({ book }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-xl p-4 flex flex-col bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <Link to={`/books/${book._id}`} className="flex-1">
        <div className="h-40 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 rounded-lg mb-3 flex items-center justify-center text-5xl overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-contain"
            />
          ) : (
            "📖"
          )}
        </div>
        <span
          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${
            categoryStyle[book.category] || "bg-gray-100 text-gray-700"
          }`}
        >
          {book.category}
        </span>
        <h3 className="font-semibold text-gray-800 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        {book.rating > 0 && (
          <p className="text-xs text-amber-500 mt-1">
            {"★".repeat(Math.round(book.rating))}
            {"☆".repeat(5 - Math.round(book.rating))}{" "}
            <span className="text-gray-400">({book.rating})</span>
          </p>
        )}
      </Link>

      <div className="flex items-center justify-between mt-3">
        <span className="font-bold text-lg bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
          ₹{book.price}
        </span>
        <button
          onClick={() => addToCart(book)}
          disabled={book.stock === 0}
          className="text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full hover:shadow-md hover:scale-105 active:scale-95 transition-transform disabled:from-gray-300 disabled:to-gray-300 disabled:hover:scale-100"
        >
          {book.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
