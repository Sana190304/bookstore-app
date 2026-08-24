import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function MobileTabBar() {
  const { user } = useAuth();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    { to: "/", icon: "📖", label: "Books" },
    user && { to: "/wishlist", icon: "❤️", label: "Wishlist" },
    { to: "/cart", icon: "🛒", label: "Cart", badge: itemCount },
    user?.role === "admin"
      ? { to: "/admin", icon: "⚙️", label: "Admin" }
      : user
      ? { to: "/orders", icon: "📦", label: "Orders" }
      : { to: "/login", icon: "👤", label: "Login" },
  ].filter(Boolean);

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 flex justify-around items-stretch z-20 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              isActive ? "text-amber-700" : "text-stone-500"
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.badge > 0 && (
            <span className="absolute top-1 right-1/4 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {tab.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
