// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getProfileAPI } from "../api/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Load user if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfileAPI();
        const profile = res?.data || res; // safe fallback

        const userData = {
          fullName: profile?.fullName || profile?.name || "User",
          email: profile?.email || "",
          phone: profile?.phone || profile?.mobile || "",
          profilePic: profile?.profilePic || profile?.avatar || null,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  // Login
  const login = (userData, tokenValue) => {
    if (tokenValue) localStorage.setItem("token", tokenValue);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));

    setToken(tokenValue || null);
    setUser(userData || null);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
