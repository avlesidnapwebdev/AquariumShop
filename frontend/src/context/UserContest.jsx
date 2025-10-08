import { createContext, useContext, useEffect, useState } from "react";
import { getProfileAPI } from "../api/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setLoading(false);
        } else if (token) {
            getProfileAPI()
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
                    localStorage.removeItem("token");
                    setUser(null);
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    // Login
    const login = (userData, tokenValue) => {
        localStorage.setItem("token", tokenValue);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);
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
