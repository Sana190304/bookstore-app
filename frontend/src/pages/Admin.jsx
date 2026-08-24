import { useState } from "react";
import AdminBooks from "../components/AdminBooks";
import AdminOrders from "../components/AdminOrders";

export default function Admin() {
  const [tab, setTab] = useState("books");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setTab("books")}
          className={`pb-2 px-1 ${
            tab === "books" ? "border-b-2 border-amber-600 text-amber-700" : "text-gray-500"
          }`}
        >
          Manage Books
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`pb-2 px-1 ${
            tab === "orders" ? "border-b-2 border-amber-600 text-amber-700" : "text-gray-500"
          }`}
        >
          Manage Orders
        </button>
      </div>

      {tab === "books" ? <AdminBooks /> : <AdminOrders />}
    </div>
  );
}
