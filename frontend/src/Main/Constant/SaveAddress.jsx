import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  getProfile,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} from "../../api/api.js";
import { Country, State, City } from "country-state-city";

export default function SaveAddress({ open, setOpen, onSelect }) {
  const sidebarRef = useRef(null);

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [house, setHouse] = useState("");
  const [road, setRoad] = useState("");

  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  useEffect(() => {
    if (open) fetchAddresses();
  }, [open]);

  const fetchAddresses = async () => {
    try {
      const res = await getProfile();
      if (res.data?.addresses) {
        setAddresses(res.data.addresses);
        const def = res.data.addresses.find((a) => a.isDefault);
        if (def) setDefaultAddressId(def._id);
      }
    } catch (err) {
      console.error("Fetch addresses failed:", err);
    }
  };

  useEffect(() => {
    setAllCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      const selected = allCountries.find((c) => c.name === country);
      if (selected) setAllStates(State.getStatesOfCountry(selected.isoCode));
      else setAllStates([]);
      setState("");
      setCity("");
    }
  }, [country]);

  useEffect(() => {
    if (state && country) {
      const selectedCountry = allCountries.find((c) => c.name === country);
      const selectedState = allStates.find((s) => s.name === state);
      if (selectedCountry && selectedState) {
        setAllCities(
          City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
        );
      } else setAllCities([]);
      setCity("");
    }
  }, [state]);

  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setPincode("");
    setCountry("");
    setState("");
    setCity("");
    setHouse("");
    setRoad("");
    setEditId(null);
    setShowForm(false);
  };

  const handleSaveAddress = async () => {
    if (!fullName || !phone || !pincode || !country || !state || !city || !house || !road) {
      alert("Please fill all fields");
      return;
    }

    const newAddress = {
      name: fullName,
      phone,
      pincode,
      country,
      state,
      city,
      addressLine1: `${house}`,
      addressLine2: `${road}`,
    };

    setLoading(true);
    try {
      if (editId) {
        const res = await updateAddress(editId, newAddress);
        setAddresses(res.data.addresses);
      } else {
        const res = await addAddress(newAddress);
        setAddresses(res.data.addresses);
      }
      resetForm();
    } catch (err) {
      console.error("Save address failed:", err);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setFullName(addr.name);
    setPhone(addr.phone);
    setPincode(addr.pincode);
    setCountry(addr.country);
    setState(addr.state);
    setCity(addr.city);
    setHouse(addr.addressLine1);
    setRoad(addr.addressLine2);
    setEditId(addr._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await removeAddress(id);
      setAddresses(res.data.addresses);
      if (id === defaultAddressId) setDefaultAddressId(null);
    } catch (err) {
      console.error("Delete address failed:", err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await setDefaultAddress(id);
      setAddresses(res.data.addresses);
      const def = res.data.addresses.find((a) => a.isDefault);
      if (def) setDefaultAddressId(def._id);
    } catch (err) {
      console.error("Set default address failed:", err);
      alert("Failed to set default address");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      onClick={() => setOpen(false)}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-96 pb-36 bg-white shadow-lg transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">Saved Addresses</h2>
          <button className="text-3xl text-blue-600" onClick={() => setOpen(false)}>
            <IoClose />
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-full scrollbar-hide space-y-6">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              + Add New Address
            </button>
          )}

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
                placeholder="Mobile Number"
                maxLength="10"
                className="w-full border rounded-lg p-2 text-black"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              <input
                type="text"
                placeholder="Pincode"
                maxLength="6"
                className="w-full border rounded-lg p-2 text-black"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              />

              <select
                className="w-full border rounded-lg p-2 text-black"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {allCountries.map((c) => (
                  <option key={c.isoCode} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full border rounded-lg p-2 text-black"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={!country}
              >
                <option value="">Select State</option>
                {allStates.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full border rounded-lg p-2 text-black"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state}
              >
                <option value="">Select City</option>
                {allCities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="House No / Building Name"
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
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  {loading
                    ? "Saving..."
                    : editId
                      ? "Update Address"
                      : "Save Address"}
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

          <div className="space-y-4">
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-center">No saved addresses yet.</p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 border rounded-lg shadow capitalize relative transition-colors duration-300  ${addr._id === defaultAddressId
                      ? "bg-green-600"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                    }`}
                >
                  <p className="font-semibold text-white">{addr.name}</p>
                  <p className="text-sm text-white">
                    {addr.addressLine1}, {addr.addressLine2}, {addr.city},{" "}
                    {addr.state}, {addr.country} - {addr.pincode}
                  </p>
                  <p className="text-sm text-white">Phone: {addr.phone}</p>

                  <div className="absolute top-2 right-2 flex space-x-2">
                    <div className="bg-blue-600 p-1 rounded-full hover:bg-blue-700 transition-colors">
                      <FiEdit
                        className="cursor-pointer text-white"
                        onClick={() => handleEdit(addr)}
                      />
                    </div>
                    <div className="bg-red-600 p-1 rounded-full hover:bg-red-700 transition-colors">
                      <FiTrash2
                        className="cursor-pointer text-white"
                        onClick={() => handleDelete(addr._id)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    {addr._id === defaultAddressId ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        className="bg-yellow-500 text-black text-xs px-2 py-1 rounded hover:bg-yellow-400"
                      >
                        Set Default
                      </button>
                    )}
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
