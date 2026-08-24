import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display text-2xl mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added any books yet.</p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="h-20 w-14 shrink-0 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 rounded overflow-hidden flex items-center justify-center text-2xl">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "📖"
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-sm text-gray-500">₹{item.price} each</p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 text-xs hover:underline mt-1"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <span className="w-20 text-right font-semibold text-amber-700">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <Link to="/" className="text-amber-700 text-sm hover:underline self-start mt-1">
            ← Continue shopping
          </Link>
        </div>

        {/* order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-xl p-5 shadow-sm sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Delivery</span>
              <span className="text-amber-700 font-medium">Free</span>
            </div>

            <div className="border-t pt-4 flex justify-between items-center mb-5">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg text-amber-700">₹{cartTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-full font-medium hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
