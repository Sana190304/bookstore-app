import { useEffect, useState } from "react";
import api from "../api/axios";
import BookCard from "../components/BookCard";

const CATEGORIES = ["All", "Fiction", "Non-fiction", "Academic"];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;

      const { data } = await api.get("/books", { params });
      setBooks(data);
      setLoading(false);
    };

    const timer = setTimeout(fetchBooks, 300); // debounce search typing
    return () => clearTimeout(timer);
  }, [search, category]);

  const featuredBook = books.find((b) => b.coverImage) || books[0];

  return (
    <div>
      {/* editorial-style light hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 animate-gradient text-stone-900">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-4 animate-fade-in-up">
              Online Bookstore
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight mb-5 animate-fade-in-up">
              Find your
              <br />
              next great read
            </h1>
            <div className="w-16 h-px bg-amber-500 mx-auto md:mx-0 mb-5" />
            <p
              className="text-stone-600 mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Fiction, Non-fiction & Academic — hand-picked titles delivered to your door.
            </p>
            <a
              href="#books"
              className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold px-7 py-3 rounded-full hover:shadow-lg hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Browse Books
            </a>
          </div>

          <div className="hidden md:flex justify-center animate-float">
            {featuredBook?.coverImage ? (
              <img
                src={featuredBook.coverImage}
                alt={featuredBook.title}
                className="w-52 rounded-md shadow-2xl shadow-amber-900/20 ring-1 ring-amber-300 rotate-3 hover:rotate-0 transition-transform duration-300"
              />
            ) : (
              <div className="w-52 h-72 rounded-md shadow-2xl bg-gradient-to-br from-amber-100 to-stone-100 ring-1 ring-amber-300 flex items-center justify-center text-6xl rotate-3">
                📖
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="books" className="max-w-6xl mx-auto px-4 py-8 scroll-mt-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-8 -mt-2 relative z-0">
          <div className="relative flex-1">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white text-gray-700 border-0 shadow-lg rounded-full pl-12 pr-5 py-3 w-full focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🏷️</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white text-gray-700 border-0 shadow-lg rounded-full pl-11 pr-10 py-3 focus:ring-2 focus:ring-amber-400 outline-none appearance-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              ▾
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No books found.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
