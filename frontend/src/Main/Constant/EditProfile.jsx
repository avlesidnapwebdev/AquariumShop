import React, { useState, useRef, useEffect } from "react";
import { IoClose, IoCamera } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { getProfileAPI, updateProfileAPI } from "../../api/api.js";

export default function EditProfile({ open, setOpen, onProfileUpdate, token }) {
  const sidebarRef = useRef(null);

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [savedData, setSavedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Always build a correct image URL
  const resolveProfilePic = (pic) => {
    if (!pic) return null;
    if (pic.startsWith("http")) return pic;
    if (pic.startsWith("/uploads")) return `${baseURL}${pic}`;
    if (pic.startsWith("uploads")) return `${baseURL}/${pic}`;
    return `${baseURL}/uploads/${pic}`;
  };

  // ✅ Fetch profile when sidebar opens
  useEffect(() => {
    if (open && token) {
      (async () => {
        try {
          const res = await getProfileAPI();
          const data = res?.data || {};

          setSavedData(data);
          setFullName(data.fullName || "");
          setMobile(data.mobile || "");
          setEmail(data.email || "");

          const img = resolveProfilePic(data.profilePic);
          setProfilePreview(img);

          // Save only raw data to localStorage
          localStorage.setItem("user", JSON.stringify(data));
        } catch (err) {
          console.error("❌ Failed to fetch profile:", err);
        }
      })();
    }
  }, [open, token]);

  // ✅ Load cached profile (on full page refresh)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setSavedData(user);
      setFullName(user.fullName || "");
      setMobile(user.mobile || "");
      setEmail(user.email || "");

      const img = resolveProfilePic(user.profilePic);
      setProfilePreview(img);
    }
  }, []);

  // ✅ Close sidebar when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  // ✅ Handle new image selection
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Save Profile
  const handleSave = async () => {
    if (!fullName || !mobile || !email) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (profileFile) formData.append("profilePic", profileFile);
      formData.append("fullName", fullName);
      formData.append("mobile", mobile);
      formData.append("email", email);

      const res = await updateProfileAPI(formData, token);
      const updated = res?.data;
      if (!updated) throw new Error("No updated profile returned.");

      setSavedData(updated);
      setProfilePreview(resolveProfilePic(updated.profilePic));
      setProfileFile(null);
      setIsEditing(false);
      setLoading(false);

      // ✅ Save only raw backend response (not resolved URL)
      localStorage.setItem("user", JSON.stringify(updated));

      if (onProfileUpdate) onProfileUpdate(updated);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Failed to update profile.");
      setLoading(false);
    }
  };

  // ✅ Cancel editing
  const handleCancel = () => {
    const img = resolveProfilePic(savedData.profilePic);
    setProfilePreview(img);
    setFullName(savedData.fullName || "");
    setMobile(savedData.mobile || "");
    setEmail(savedData.email || "");
    setProfileFile(null);
    setIsEditing(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={() => setOpen(false)}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">Edit Profile</h2>
          <button
            className="text-2xl text-blue-600 hover:text-red-500 transition"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto h-full space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />
              ) : (
                <FaUserCircle className="w-28 h-28 text-blue-400 border-2 border-blue-500 rounded-full" />
              )}

              {isEditing && (
                <>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                  >
                    <IoCamera />
                  </label>
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileChange}
                  />
                </>
              )}
            </div>
          </div>

          {/* Fields */}
          {!isEditing ? (
            <div className="space-y-4 text-blue-500">
              <div>
                <p className="font-semibold">Name</p>
                <p className="text-gray-800">{fullName || "—"}</p>
              </div>
              <div>
                <p className="font-semibold">Mobile</p>
                <p className="text-gray-800">{mobile || "—"}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-800">{email || "—"}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-3 hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-blue-600">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile"
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1 hover:bg-green-700 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg flex-1 hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
