import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "",
  author: "",
  description: "",
  category: "Fiction",
  price: "",
  stock: "",
  coverImage: "",
};

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadBooks = async () => {
    const { data } = await api.get("/books");
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };

    if (editingId) {
      await api.put(`/books/${editingId}`, payload);
    } else {
      await api.post("/books", payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    loadBooks();
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      description: book.description || "",
      category: book.category,
      price: book.price,
      stock: book.stock,
      coverImage: book.coverImage || "",
    });
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    await api.delete(`/books/${id}`);
    loadBooks();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h2 className="font-semibold">{editingId ? "Edit Book" : "Add New Book"}</h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          rows={3}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option>Fiction</option>
          <option>Non-fiction</option>
          <option>Academic</option>
        </select>
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="coverImage"
          placeholder="Cover image URL (optional)"
          value={form.coverImage}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            {editingId ? "Update Book" : "Add Book"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
              }}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
        {books.map((book) => (
          <div key={book._id} className="border rounded p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-8 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-sm shrink-0">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                ) : (
                  "📖"
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{book.title}</p>
                <p className="text-xs text-gray-500">
                  ₹{book.price} · {book.stock} in stock
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => handleEdit(book)} className="text-amber-700 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(book._id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
