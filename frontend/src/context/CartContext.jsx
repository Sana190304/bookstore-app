import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === book._id);
      if (existing) {
        return prev.map((item) =>
          item._id === book._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...book, quantity }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item._id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item._id === bookId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
