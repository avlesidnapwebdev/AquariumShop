import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  addCard,
  removeCard,
  getProfile,
  setDefaultCard,
} from "../../api/api.js";

export default function SaveCards({ open, setOpen }) {
  const sidebarRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardType, setCardType] = useState("");

  const [visibleCVV, setVisibleCVV] = useState({});
  const [localCvvs, setLocalCvvs] = useState({});

  const cardOptions = [
    "Visa Debit Card",
    "Mastercard Debit Card",
    "RuPay Debit Card",
    "Regular Credit Card",
    "Standard Credit Card",
    "Premium / Super-Premium / Elite Credit Card",
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;

    const fetchCards = async () => {
      try {
        const { data } = await getProfile();
        const fetchedCards = data.cards || [];
        setCards(fetchedCards);

        const savedCVVs = JSON.parse(localStorage.getItem("cvv_map") || "{}");
        const updatedCVVs = { ...savedCVVs };
        fetchedCards.forEach((card) => {
          if (!(card._id in updatedCVVs)) updatedCVVs[card._id] = "***";
        });
        setLocalCvvs(updatedCVVs);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    fetchCards();
  }, [open]);

  const handleAddCard = async () => {
    if (!cardName || !cardNumber || !cvv || !expiry || !cardType) {
      alert("Please fill all fields");
      return;
    }

    const [month, year] = expiry.split("/");
    const newCard = {
      providerToken: `mock-${Date.now()}`,
      brand: cardType,
      last4: cardNumber.slice(-4),
      expiryMonth: Number(month),
      expiryYear: Number(year),
      isDefault: false,
      name: cardName.trim(), // ensure no leading/trailing spaces
      cvv,
    };

    try {
      setLoading(true);
      const { data } = await addCard(newCard);
      const updated = data.cards || [];
      setCards(updated);

      const lastCard = updated[updated.length - 1];
      if (lastCard && lastCard._id) {
        const map = { ...(localCvvs || {}), [lastCard._id]: cvv };
        localStorage.setItem("cvv_map", JSON.stringify(map));
        setLocalCvvs(map);
      }

      setShowForm(false);
      setCardName("");
      setCardNumber("");
      setCvv("");
      setExpiry("");
      setCardType("");
    } catch (err) {
      console.error("Error adding card:", err);
      alert("Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("Delete this card?")) return;

    try {
      setLoading(true);
      const { data } = await removeCard(id);
      setCards(data.cards || []);

      const map = { ...(localCvvs || {}) };
      delete map[id];
      localStorage.setItem("cvv_map", JSON.stringify(map));
      setLocalCvvs(map);
    } catch (err) {
      console.error("Error deleting card:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCVV = (id) => {
    setVisibleCVV((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2, 4);
    setExpiry(val);
  };

  const getDisplayCVV = (id) => {
    const stored = localCvvs[id];
    const show = visibleCVV[id];
    if (!stored || stored === "***") return "***";
    return show ? stored : "•••";
  };

  const handleSetDefault = async (id) => {
    try {
      setLoading(true);
      await setDefaultCard(id);

      const updated = cards.map((c) => ({
        ...c,
        isDefault: c._id === id,
      }));
      setCards(updated);
    } catch (err) {
      console.error("Error setting default card:", err);
      alert("Failed to set default card. Check API endpoint or card ID.");
    } finally {
      setLoading(false);
    }
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
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">Saved Cards</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-3xl text-blue-600"
          >
            <IoClose />
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-full space-y-6">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              + Add New Card
            </button>
          )}

          {showForm && (
            <div className="p-4 border rounded-lg shadow space-y-3 text-black">
              <input
                type="text"
                placeholder="Card Holder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full border rounded-lg p-2" // removed uppercase
              />
              <input
                type="text"
                placeholder="Card Number"
                maxLength="16"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, ""))
                }
                className="w-full border rounded-lg p-2"
              />
              <select
                className="w-full border rounded-lg p-2"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              >
                <option value="">Select Card Type</option>
                {cardOptions.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength="3"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  className="w-1/3 border rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={expiry}
                  onChange={handleExpiryChange}
                  className="w-2/3 border rounded-lg p-2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddCard}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {cards.length === 0 ? (
              <p className="text-gray-500 text-center">No saved cards yet.</p>
            ) : (
              cards.map((card) => (
                <div
                  key={card._id}
                  className={`p-4 border rounded-lg shadow text-white relative transition-colors duration-300 ${
                    card.isDefault
                      ? "bg-green-600 from-green-500 to-green-700"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }`}
                >
                  <p className="font-semibold text-lg">
                    {card.brand || "Card"}
                  </p>
                  <p className="text-sm italic text-gray-200">
                    {card.name || "Card Holder"}
                  </p>
                  <p className="tracking-widest text-xl mt-1">
                    **** **** **** {card.last4}
                  </p>
                  <div className="flex justify-between text-sm mt-1">
                    <span>
                      Exp:{" "}
                      {card.expiryMonth && card.expiryYear
                        ? `${String(card.expiryMonth).padStart(
                            2,
                            "0"
                          )}/${String(card.expiryYear).slice(-2)}`
                        : "N/A"}
                    </span>
                    {card.isDefault && (
                      <span className="bg-black/20 px-2 py-1 text-xs rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">
                      CVV:{" "}
                      <span className="font-mono">
                        {getDisplayCVV(card._id)}
                      </span>
                    </p>
                    <button
                      onClick={() => toggleCVV(card._id)}
                      className="text-xs underline text-gray-200"
                    >
                      {visibleCVV[card._id] ? "Hide" : "Show"}
                    </button>
                  </div>

                  {!card.isDefault && (
                    <button
                      onClick={() => handleSetDefault(card._id)}
                      disabled={loading}
                      className="mt-2 bg-yellow-500 text-black px-2 py-1 text-xs rounded"
                    >
                      Set as Default
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteCard(card._id)}
                    disabled={loading}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
