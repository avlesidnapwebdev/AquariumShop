import React, { useState, useEffect } from "react";
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
  const [user, setUser] = useState({
    fullName: "Guest",
    email: "",
    phone: "",
    profilePic: null,
  });

  const API =
    import.meta.env.VITE_API_URL || "https://aquariumshop.onrender.com";

  // --- Login handler ---
  const handleLogin = (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);

    // Save token and user data
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // --- Logout handler ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser({ fullName: "Guest", email: "", phone: "", profilePic: null });
  };

  // --- Restore login state on refresh ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Fetch user profile from backend
        fetch(`${API}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
          })
          .then((profileData) => {
            if (profileData) {
              const userData = {
                fullName: profileData.fullName || "User",
                email: profileData.email || "",
                phone: profileData.mobile || "",
                profilePic: profileData.profilePic || null,
              };
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            }
          })
          .catch((err) => {
            console.error("Profile fetch error:", err);
            handleLogout();
          });
      }
    }
  }, []);

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
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
