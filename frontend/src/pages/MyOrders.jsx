import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusColor = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-stone-200 text-stone-700",
  delivered: "bg-amber-200 text-amber-900",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center py-24 text-gray-500">Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="font-display text-2xl mb-2">No orders yet</h1>
        <p className="text-gray-500 mb-6">Your placed orders will show up here.</p>
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-6">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order, i) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-5 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">
                Order #{order._id.slice(-6)} · {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColor[order.orderStatus]}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <ul className="text-sm text-gray-700 mb-3 flex flex-col gap-1">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.book?.title || "Book"} × {item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-bold text-amber-700">₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
