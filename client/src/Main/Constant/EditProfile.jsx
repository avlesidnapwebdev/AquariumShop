// EditProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoClose, IoCamera } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa"; // dummy profile icon

export default function EditProfile({ open, setOpen }) {
  const sidebarRef = useRef(null);

  // Saved states (the actual profile data)
  const [savedProfilePic, setSavedProfilePic] = useState(null);
  const [savedFirstName, setSavedFirstName] = useState("Selva");
  const [savedLastName, setSavedLastName] = useState("Pandi");
  const [savedMobile, setSavedMobile] = useState("9876543210");
  const [savedEmail, setSavedEmail] = useState("selva@example.com");

  // Editable states (for temporary changes before save)
  const [profilePic, setProfilePic] = useState(savedProfilePic);
  const [firstName, setFirstName] = useState(savedFirstName);
  const [lastName, setLastName] = useState(savedLastName);
  const [mobile, setMobile] = useState(savedMobile);
  const [email, setEmail] = useState(savedEmail);

  // Mode: view or edit
  const [isEditing, setIsEditing] = useState(false);

  // Handle outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  // Handle profile picture upload
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSave = () => {
    setSavedProfilePic(profilePic);
    setSavedFirstName(firstName);
    setSavedLastName(lastName);
    setSavedMobile(mobile);
    setSavedEmail(email);
    setIsEditing(false);
  };

  // Cancel changes
  const handleCancel = () => {
    setProfilePic(savedProfilePic);
    setFirstName(savedFirstName);
    setLastName(savedLastName);
    setMobile(savedMobile);
    setEmail(savedEmail);
    setIsEditing(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={() => setOpen(false)}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">Edit Profile</h2>
          <button
            className="text-2xl text-blue-600"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto h-full scrollbar-hide space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {isEditing ? (
                profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <FaUserCircle className="w-28 h-28 text-blue-400 border-2 border-blue-500 rounded-full" />
                )
              ) : savedProfilePic ? (
                <img
                  src={savedProfilePic}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-blue-500"
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

          {/* Profile Info */}
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-blue-500">Name</p>
                <p className="font-semibold text-gray-800">
                  {savedFirstName} {savedLastName}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-blue-500">Mobile</p>
                <p className="font-semibold text-gray-800">{savedMobile}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-blue-500">Email</p>
                <p className="font-semibold text-gray-800">{savedEmail}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* First + Last Name */}
              <div>
                <label className="block mb-1 text-base font-semibold text-blue-500">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border text-black rounded-lg p-2 mb-3"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <label className="block text-base font-semibold text-blue-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full border text-black rounded-lg p-2 mb-3"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-base font-semibold text-blue-500 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="w-full border text-black rounded-lg p-2 mb-3"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-base font-semibold text-blue-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border text-black rounded-lg p-2 mb-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1"
                >
                  Save
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
