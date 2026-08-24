import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const { data } = await api.get("/orders");
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, orderStatus) => {
    await api.put(`/orders/${id}/status`, { orderStatus });
    loadOrders();
  };

  if (orders.length === 0) {
    return <p className="text-gray-500">No orders yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <div key={order._id} className="border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-sm">
              #{order._id.slice(-6)} · {order.user?.name} ({order.user?.email})
            </p>
            <p className="text-xs text-gray-500">
              {order.items.map((item) => item.book?.title).join(", ")}
            </p>
            <p className="text-sm font-semibold mt-1">₹{order.totalAmount}</p>
          </div>

          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
            className="border rounded px-2 py-1.5 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
