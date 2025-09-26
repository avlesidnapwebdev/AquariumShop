// src/main.jsx OR src/index.jsx (whichever you use as entry point)
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./Main/Constant/AddToCart.jsx";
import { WishlistProvider } from "./Main/Constant/Wishlist.jsx";
import { OrderProvider } from "./Main/Constant/Order.jsx"; // ✅ import

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <WishlistProvider>
        <OrderProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </OrderProvider>
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);
