import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../api/api.js"; // ✅ fixed import

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  // Login
  const [loginEmailPhone, setLoginEmailPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // --- handle login ---
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const identifier = loginEmailPhone.trim();

    const payload = identifier.includes("@")
      ? { email: identifier, password: loginPassword }
      : { mobile: identifier, password: loginPassword };

    const data = await loginAPI(payload);

    const token =
      data?.token ||
      data?.accessToken ||
      data?.jwt ||
      null;

    if (!token) throw new Error("No token returned from server");

    localStorage.setItem("token", token);

    const userObj = {
      fullName: data?.user?.fullName || data?.fullName || data?.name || "User",
      email: data?.user?.email || data?.email || "",
      phone: data?.user?.mobile || data?.mobile || data?.phone || "",
      profilePic: data?.user?.profilePic || data?.profilePic || null,
    };

    localStorage.setItem("user", JSON.stringify(userObj));

    onLogin?.(userObj, token);

    alert("Login successful!");
    navigate("/");
  } catch (err) {
    console.error("❌ Login error:", err);

    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Login failed. Check email/mobile & password.";

    alert(message);
  }
};


  // --- handle register ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword)
      return alert("Passwords do not match");

    try {
      const payload = {
        fullName,
        email: regEmail,
        mobile: regMobile,
        password: regPassword,
      };

      const res = await registerAPI(payload);
      const data = res.data || {};

      const token =
        data.token || data?.user?.token || data?.accessToken || null;
      const user = data.user || data;

      if (token) localStorage.setItem("token", token);

      const userObj = {
        fullName: user?.fullName || fullName,
        email: user?.email || regEmail,
        phone: user?.mobile || regMobile,
        profilePic: user?.profilePic || null,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      onLogin?.(userObj, token);
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Make sure email or mobile is unique.";
      alert(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <motion.div
        className="relative w-[400px] h-[520px] perspective"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Login */}
        <div
          className="absolute w-full h-auto bg-white rounded-2xl shadow-xl p-8 backface-hidden"
          style={{ transform: "rotateY(0deg)" }}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4 text-blue-500">
            <div>
              <label className="text-sm font-medium">Email or Mobile</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1 text-black font-medium"
                value={loginEmailPhone}
                onChange={(e) => setLoginEmailPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  className="w-full border rounded-lg p-2 mt-1 pr-10 text-black font-medium"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-blue-500"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-blue-500">
            Not registered?{" "}
            <button
              onClick={() => setIsFlipped(true)}
              className="text-blue-600 font-semibold hover:text-red-500 underline"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Register */}
        <div
          className="absolute w-full h-auto bg-white text-blue-500 font-medium rounded-2xl shadow-xl p-8 backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
            Register
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm">Full Name</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1 text-black font-medium"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg p-2 mt-1 text-black font-medium"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Mobile</label>
              <input
                type="tel"
                className="w-full border rounded-lg p-2 mt-1 text-black font-medium"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <div className="relative">
                <input
                  type={showRegPassword ? "text" : "password"}
                  className="w-full border rounded-lg p-2 mt-1 pr-10 text-black font-medium"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-blue-500"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                >
                  {showRegPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showRegConfirmPassword ? "text" : "password"}
                  className="w-full border rounded-lg p-2 mt-1 pr-10 text-black font-medium"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-blue-500"
                  onClick={() =>
                    setShowRegConfirmPassword(!showRegConfirmPassword)
                  }
                >
                  {showRegConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => setIsFlipped(false)}
              className="text-green-600 underline font-semibold text-xl hover:text-red-500"
            >
              Login here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
