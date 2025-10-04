// SaveCards.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function SaveCards({ open, setOpen }) {
  const sidebarRef = useRef(null);
 
  // States
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

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

  // Save new card
  const handleAddCard = () => {
    if (!cardName || !cardNumber || !cvv || !expiry) {
      alert("Please fill all fields");
      return;
    }

    const newCard = {
      id: Date.now(),
      name: cardName,
      number: cardNumber,
      cvv,
      expiry,
    };

    setCards([...cards, newCard]);
    setCardName("");
    setCardNumber("");
    setCvv("");
    setExpiry("");
    setShowForm(false);
  };

  // Delete card
  const handleDeleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  // Mask card number (show only last 4 digits)
  const maskCardNumber = (num) => {
    return num.replace(/\d(?=\d{4})/g, "*");
  };

  // Format MM/YY
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Only numbers
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiry(value);
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
          <h2 className="text-xl font-bold text-blue-600">Saved Cards</h2>
          <button
            className="text-3xl text-blue-600"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto h-full scrollbar-hide space-y-6">
          {/* Add Card Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              + Add New Card
            </button>
          )}

          {/* Add Card Form */}
          {showForm && (
            <div className="p-4 border text-black rounded-lg shadow space-y-3">
              <input
                type="text"
                placeholder="Card Holder Name"
                className="w-full border rounded-lg p-2"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Card Number"
                maxLength="16"
                className="w-full border rounded-lg p-2"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, ""))
                }
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength="3"
                  className="w-1/3 border rounded-lg p-2"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                />
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-2/3 border rounded-lg p-2"
                  value={expiry}
                  onChange={handleExpiryChange}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddCard}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  Save Card
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

          {/* Saved Cards */}
          <div className="space-y-4">
            {cards.length === 0 ? (
              <p className="text-gray-500 text-center">No saved cards yet.</p>
            ) : (
              cards.map((card) => (
                <div
                  key={card.id}
                  className="p-4 border rounded-lg shadow bg-gradient-to-r from-blue-500 to-indigo-600 text-white relative"
                >
                  <p className="font-semibold text-lg">{card.name}</p>
                  <p className="tracking-widest text-xl mt-1">
                    {maskCardNumber(card.number)}
                  </p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Expiry: {card.expiry}</span>
                    <span>CVV: ***</span>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
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
