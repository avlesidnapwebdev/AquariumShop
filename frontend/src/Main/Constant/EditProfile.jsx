import React, { useState, useRef, useEffect } from "react";
import { IoClose, IoCamera } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

export default function EditProfile({
  open,
  setOpen,
  onProfileUpdate,
  isLoggedIn,
  token,
}) {
  const sidebarRef = useRef(null);

  const [savedProfilePic, setSavedProfilePic] = useState(null);
  const [savedFullName, setSavedFullName] = useState("");
  const [savedMobile, setSavedMobile] = useState("");
  const [savedEmail, setSavedEmail] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear profile data (on logout or first open)
  const clearProfile = () => {
    setSavedProfilePic(null);
    setSavedFullName("");
    setSavedMobile("");
    setSavedEmail("");
    setProfilePic(null);
    setFullName("");
    setMobile("");
    setEmail("");
    setIsEditing(false);
  };

  // Fetch profile data (placeholder – connect later with backend)
  useEffect(() => {
    if (open && isLoggedIn && token) {
      // ⏳ Later: fetch user profile from your backend here
      // Right now just using saved state / placeholders
      setIsEditing(false);
    }

    if (!isLoggedIn) clearProfile();
  }, [open, isLoggedIn, token]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);

    // ⏳ Later: send formData to backend here
    setSavedProfilePic(profilePic);
    setSavedFullName(fullName);
    setSavedMobile(mobile);
    setSavedEmail(email);

    setIsEditing(false);
    setLoading(false);

    if (onProfileUpdate) {
      onProfileUpdate({ profilePic, fullName, mobile, email });
    }
  };

  const handleCancel = () => {
    setProfilePic(savedProfilePic);
    setFullName(savedFullName);
    setMobile(savedMobile);
    setEmail(savedEmail);
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
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">Edit Profile</h2>
          <button
            className="text-2xl text-blue-600"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-full space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-contain border-2 border-blue-500"
                />
              ) : (
                <FaUserCircle className="w-28 h-28 text-blue-400 border-2 border-blue-500 rounded-full" />
              )}
              {isEditing && (
                <>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
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

          {!isEditing ? (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-blue-500">Name</p>
              <p className="font-semibold text-gray-800">{savedFullName}</p>
              <p className="text-lg font-semibold text-blue-500">Mobile</p>
              <p className="font-semibold text-gray-800">{savedMobile}</p>
              <p className="text-lg font-semibold text-blue-500">Email</p>
              <p className="font-semibold text-gray-800">{savedEmail}</p>

              {isLoggedIn && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Edit Profile
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-blue-500">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile"
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border p-2 rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg flex-1"
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
