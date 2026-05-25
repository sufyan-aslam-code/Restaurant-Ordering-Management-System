import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart in localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add To Cart (Updates existing quantity if product is already in cart)
  const addToCart = (food, quantityAdded = 1) => {
    const existingItem = cartItems.find((item) => item.id === food.id);

    if (existingItem) {
      // If Pizza is already there, just add the new quantity to the existing quantity
      setCartItems(
        cartItems.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + quantityAdded }
            : item
        )
      );
    } else {
      // If it's a new product, add it as a new row
      setCartItems([...cartItems, { ...food, quantity: quantityAdded }]);
    }
  };

  // Remove Item
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Increase Quantity (For the + button inside the cart page)
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease Quantity (For the - button inside the cart page)
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item
      )
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total Price (Respects discount price, multiplies by quantity)
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
    0
  );

  // Total Quantity (Counts UNIQUE products only - if you have 5 different meals, it returns 5)
  const totalQuantity = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => useContext(CartContext);