import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

// Context Providers
import { AuthProvider } from "./context/UserContest.jsx";
import { CartProvider } from "./Main/Constant/AddToCart.jsx";
import { WishlistProvider } from "./Main/Constant/Wishlist.jsx";
import { OrderProvider } from "./Main/Constant/Order.jsx";

// Main App
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
