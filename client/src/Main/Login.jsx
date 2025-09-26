// Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  // Login states
  const [loginEmailPhone, setLoginEmailPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register states
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: loginEmailPhone,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Try again.");
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful. Please login.");
        setIsFlipped(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed. Try again.");
    }
  };

  // Handle Google login (works for both login & signup)
  const handleGoogleLogin = async () => {
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const res = await fetch("http://localhost:5000/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tokenId: response.credential }),
            });
            const data = await res.json();
            if (res.ok) {
              localStorage.setItem("token", data.token);
              navigate("/");
            } else {
              alert(data.message);
            }
          } catch (err) {
            console.error(err);
            alert("Google login failed.");
          }
        },
      });
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error(err);
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
        {/* -------- Login Card -------- */}
        <div
          className="absolute w-full h-full bg-white rounded-2xl shadow-xl p-8 backface-hidden"
          style={{ transform: "rotateY(0deg)" }}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4 text-blue-500">
            {/* Email / Phone */}
            <div>
              <label className="text-sm font-medium">Email or Phone</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1 text-black font-medium"
                value={loginEmailPhone}
                onChange={(e) => setLoginEmailPhone(e.target.value)}
                required
              />
            </div>

            {/* Password */}
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

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Login
            </button>

            {/* OTP Login */}
            <button
              type="button"
              className="w-full border border-blue-600 text-blue-600 font-medium py-2 rounded-lg"
            >
              Login with OTP
            </button>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border border-gray-400 font-medium text-blue-500 flex items-center justify-center gap-2 py-2 rounded-lg"
            >
              <FaGoogle className="text-blue-500 font-medium" /> Login with Google
            </button>
          </form>

          {/* Flip to Register */}
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

        {/* -------- Register Card -------- */}
        <div
          className="absolute w-full h-auto bg-white text-blue-500 font-medium rounded-2xl shadow-xl p-8 backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
            Register
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
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

            {/* Email */}
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

            {/* Phone */}
            <div>
              <label className="text-sm">Phone</label>
              <input
                type="tel"
                className="w-full border rounded-lg p-2 mt-1 text-black font-medium"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
              />
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
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

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Register
            </button>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border border-gray-400 font-medium text-green-600 flex items-center justify-center gap-2 py-2 rounded-lg mt-2"
            >
              <FaGoogle className="text-green-600 font-medium" /> Sign up with Google
            </button>
          </form>

          {/* Flip to Login */}
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
