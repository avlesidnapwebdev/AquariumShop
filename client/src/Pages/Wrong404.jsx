// src/Pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

// ✅ Components
import Header from "../Main/Header.jsx";
import Footer from "../Main/Footer.jsx";

export default function NotFound({ isLoggedIn, username, onLogout }) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ✅ Header */}
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />

      {/* ✅ Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        {/* Error Image */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
          alt="404 error"
          className="w-52 h-52 object-contain mb-6"
        />

        {/* Error Text */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Oops! That Page Can’t Be Found.
        </h1>
        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist or another error occurred.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            ⬅ Back to Home
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow hover:bg-orange-600 transition"
          >
            🛒 Back to Shop
          </Link>
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
