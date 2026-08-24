import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError("");

    try {
      const items = cart.map((item) => ({ bookId: item._id, quantity: item.quantity }));

      // 1. ask backend to create a Razorpay order for this amount
      const { data: razorpayOrder } = await api.post("/payment/create-order", {
        amount: cartTotal,
      });

      // 2. open Razorpay's checkout popup (Cards, UPI/Google Pay, Netbanking, Wallets)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "BookNest",
        description: "Book purchase",
        order_id: razorpayOrder.id,
        prefill: {
          name: address.fullName || user?.name,
          email: user?.email,
          contact: address.phone,
        },
        theme: { color: "#d97706" },
        handler: async (response) => {
          // 3. payment succeeded -> create the real order in our DB (backend verifies signature)
          try {
            const { data } = await api.post("/orders", {
              items,
              shippingAddress: address,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate("/orders", { state: { placedOrderId: data._id } });
          } catch (err) {
            setError(err.response?.data?.message || "Payment succeeded but order failed. Contact support.");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => setPlacing(false), // user closed the popup without paying
        },
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start payment");
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="fullName"
          placeholder="Full name"
          value={address.fullName}
          onChange={handleChange}
          className="border rounded px-3 py-2 sm:col-span-2"
          required
        />
        <input
          name="phone"
          placeholder="Phone number"
          value={address.phone}
          onChange={handleChange}
          className="border rounded px-3 py-2 sm:col-span-2"
          required
        />
        <input
          name="addressLine"
          placeholder="Address"
          value={address.addressLine}
          onChange={handleChange}
          className="border rounded px-3 py-2 sm:col-span-2"
          required
        />
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="pincode"
          placeholder="Pincode"
          value={address.pincode}
          onChange={handleChange}
          className="border rounded px-3 py-2 sm:col-span-2"
          required
        />

        <div className="sm:col-span-2 border-t pt-4 mt-2 flex justify-between items-center">
          <span className="text-lg font-bold">Total: ₹{cartTotal}</span>
          <button
            type="submit"
            disabled={placing}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:from-gray-300 disabled:to-gray-300 disabled:hover:scale-100"
          >
            {placing ? "Processing..." : "Pay & Place Order"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm sm:col-span-2">{error}</p>}
      </form>
    </div>
  );
}
