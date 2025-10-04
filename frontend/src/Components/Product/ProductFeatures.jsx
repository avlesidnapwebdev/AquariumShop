import React from "react";
import { FaTruck, FaMoneyBillWave, FaUndo } from "react-icons/fa";

export default function ProductFeatures() {
  const features = [
    { icon: <FaTruck />, text: "Free Delivery" },
    { icon: <FaMoneyBillWave />, text: "Cash/Pay on Delivery" },
    { icon: <FaUndo />, text: "10 Days Refund/Replacement" },
  ];
 
  return (
    <div className="grid md:grid-cols-3 gap-4 text-center my-8 text-blue-500">
      {features.map((f, i) => (
        <div
          key={i}
          className="p-4 border rounded shadow-sm flex flex-col items-center 
                     transform transition-transform duration-300 hover:scale-105 hover:shadow-md"
        >
          <div className="text-2xl mb-2">{f.icon}</div>
          <p>{f.text}</p>
        </div>
      ))}
    </div>
  );
}
