import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLink =
    "relative py-1 text-stone-700 hover:text-amber-700 transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-amber-600 after:transition-all hover:after:w-full";

  return (
    <nav className="bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 animate-gradient sticky top-0 z-30 shadow-sm border-b border-amber-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="font-display text-lg sm:text-2xl text-stone-900 flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="animate-float inline-block">📚</span>
          <span>BookNest</span>
        </Link>

        {/* full link row — desktop/tablet only, mobile uses the bottom tab bar instead */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={navLink}>
            📖 Books
          </Link>

          {user && (
            <Link to="/wishlist" className={navLink}>
              ❤️ Wishlist
            </Link>
          )}

          <Link to="/cart" className={`relative ${navLink}`}>
            🛒 Cart
            {itemCount > 0 && (
              <span className="absolute -top-2.5 -right-3 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md shadow-amber-400/50 animate-pulse">
                {itemCount}
              </span>
            )}
          </Link>

          {user && (
            <Link to="/orders" className={navLink}>
              📦 Orders
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className={navLink}>
              ⚙️ Admin
            </Link>
          )}

          <div className="h-6 w-px bg-stone-300" />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-stone-500 hidden md:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-white border border-stone-300 px-4 py-1.5 rounded-full hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-1.5 rounded-full font-semibold shadow-lg shadow-amber-900/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              Login
            </Link>
          )}
        </div>

        {/* mobile — just the essentials, everything else lives in the bottom tab bar */}
        <div className="flex sm:hidden items-center gap-2">
          <Link to="/cart" className="relative text-xl px-1">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white border border-stone-300 px-3 py-1.5 rounded-full text-sm hover:bg-stone-100 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
