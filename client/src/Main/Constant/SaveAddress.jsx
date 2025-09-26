// SaveAddress.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function SaveAddress({ open, setOpen }) {
  const sidebarRef = useRef(null);

  // States
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [house, setHouse] = useState("");
  const [road, setRoad] = useState("");

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  // Reset form
  const resetForm = () => {
    setFullName("");
    setPhone("");
    setPincode("");
    setState("");
    setCity("");
    setHouse("");
    setRoad("");
    setEditId(null);
    setShowForm(false);
  };

  // Save address
  const handleSaveAddress = () => {
    if (!fullName || !phone || !pincode || !state || !city || !house || !road) {
      alert("Please fill all fields");
      return;
    }

    const newAddress = {
      id: editId || Date.now(),
      fullName,
      phone,
      pincode,
      state,
      city,
      house,
      road,
    };

    if (editId) {
      setAddresses(
        addresses.map((addr) => (addr.id === editId ? newAddress : addr))
      );
    } else {
      setAddresses([...addresses, newAddress]);
    }

    resetForm();
  };

  // Edit address
  const handleEdit = (addr) => {
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setPincode(addr.pincode);
    setState(addr.state);
    setCity(addr.city);
    setHouse(addr.house);
    setRoad(addr.road);
    setEditId(addr.id);
    setShowForm(true);
  };

  // Delete address
  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
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
          <h2 className="text-xl font-bold text-blue-600">Saved Addresses</h2>
          <button
            className="text-3xl text-blue-600"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto h-full scrollbar-hide space-y-6">
          {/* Add Address Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              + Add New Address
            </button>
          )}

          {/* Address Form */}
          {showForm && (
            <div className="p-4 border rounded-lg shadow space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg p-2 text-black"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                maxLength="10"
                className="w-full border rounded-lg p-2 text-black"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
              />
              <input
                type="text"
                placeholder="Pincode"
                maxLength="6"
                className="w-full border rounded-lg p-2 text-black"
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, ""))
                }
              />
              <input
                type="text"
                placeholder="State"
                className="w-full border rounded-lg p-2 text-black"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <input
                type="text"
                placeholder="City"
                className="w-full border rounded-lg p-2 text-black"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                type="text"
                placeholder="House No, Building Name"
                className="w-full border rounded-lg p-2 text-black"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
              />
              <input
                type="text"
                placeholder="Road / Area / Colony"
                className="w-full border rounded-lg p-2 text-black"
                value={road}
                onChange={(e) => setRoad(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveAddress}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  {editId ? "Update Address" : "Save Address"}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Saved Addresses */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-center">
                No saved addresses yet.
              </p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 border rounded-lg shadow capitalize bg-blue-50 relative"
                >
                  <p className="font-semibold text-blue-500">Name : {addr.fullName}</p>
                  <p className="text-sm text-blue-600">Address : {" "}
                    {addr.house}, {addr.road}, {addr.city}, {addr.state} -{" "}
                    {addr.pincode}
                  </p>
                  <p className="text-sm text-blue-600">PhoneNo : {addr.phone}</p>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <FiEdit
                      className="cursor-pointer text-blue-600"
                      onClick={() => handleEdit(addr)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(addr.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
