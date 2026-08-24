import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import BookCard from "../components/BookCard";

export default function Wishlist() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/wishlist").then(({ data }) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-center py-24 text-gray-500">Loading wishlist...</p>;
  }

  if (books.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🤍</div>
        <h1 className="font-display text-2xl mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">
          Tap the ♡ on any book to save it here for later.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-6">
        <span className="text-amber-600">❤</span> My Wishlist
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {books.map((book, i) => (
          <div
            key={book._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
