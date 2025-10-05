// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Pages
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

// API
import { getProfile } from "./api/api.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    fullName: "Guest",
    email: "",
    phone: "",
    profilePic: null,
  });

  /* =====================================================
     ✅ Handle login success
     - Save token and user data
     ===================================================== */
  const handleLogin = (userData, token) => {
    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      setUser((prev) => ({ ...prev, fullName: "User" }));
    }
  };

  /* =====================================================
     ✅ Handle logout
     ===================================================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser({
      fullName: "Guest",
      email: "",
      phone: "",
      profilePic: null,
    });
  };

  /* =====================================================
     ✅ Restore session on page load
     ===================================================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore parse error
        }
      } else {
        // Fetch profile from backend if not saved locally
        getProfile()
          .then((res) => {
            const profile = res.data;
            const userData = {
              fullName: profile?.fullName || profile?.name || "User",
              email: profile?.email || "",
              phone: profile?.phone || profile?.mobile || "",
              profilePic: profile?.profilePic || profile?.avatar || null,
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          })
          .catch((err) => {
            console.error("Failed to fetch profile:", err);
            handleLogout();
          });
      }
    }
  }, []);

  /* =====================================================
     ✅ ROUTES
     ===================================================== */
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            isLoggedIn={isLoggedIn}
            username={user.fullName}
            profilePic={user.profilePic}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProductPage
            isLoggedIn={isLoggedIn}
            username={user.fullName}
            profilePic={user.profilePic}
            onLogout={handleLogout}
          />
        }
      />

      <Route path="/buy-now" element={<BuyNow />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/ordertracking" element={<OrderTracking />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/order" element={<Order />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          <Login onLogin={(userData, token) => handleLogin(userData, token)} />
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
