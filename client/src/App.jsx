import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Shop from "./Pages/Shop.jsx";
import Wishlist from "./Pages/WishList.jsx";
import FAQ from "./Pages/FAQ.jsx";
import NotFound from "./Pages/Wrong404.jsx";
import OrderTracking from "./Pages/OrderTracking.jsx";
import Login from "./Main/Login.jsx";
import ProductPage from "./Pages/Product.jsx";
import BuyNow from "./Pages/BuyNow.jsx";
import CheckOut from "./Pages/CheckOut.jsx";
import Order from "./Pages/Order.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Selvapandi");

  const handleLogin = (userName) => {
    setIsLoggedIn(true);
    if (userName) setUsername(userName);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("Guest");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            isLoggedIn={isLoggedIn}
            username={username}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProductPage
            isLoggedIn={isLoggedIn}
            username={username}
            onLogout={handleLogout}
          />
        }
      />

      <Route path="/buy-now" element={<BuyNow />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/OrderTracking" element={<OrderTracking />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/order" element={<Order />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
