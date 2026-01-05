import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/UserContest.jsx";

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

export default function App() {
  const auth = useAuth() || {};

  const {
    user = null,
    token = null,
    login = () => {},
    logout = () => {},
  } = auth;

  const isLoggedIn = !!token;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/shop"
        element={
          <Shop
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/wishlist"
        element={
          <Wishlist
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/ordertracking"
        element={
          <OrderTracking
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/faq"
        element={
          <FAQ
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/buy-now"
        element={
          <BuyNow
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/checkout"
        element={
          <CheckOut
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/order"
        element={
          <Order
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProductPage
            isLoggedIn={isLoggedIn}
            username={user?.fullName}
            profilePic={user?.profilePic}
            onLogout={logout}
          />
        }
      />

      <Route path="/login" element={<Login onLogin={login} />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
