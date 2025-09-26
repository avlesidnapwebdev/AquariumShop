import React from "react";
import brd from "../../../assets/fish/brand1.png";
import brd2 from "../../../assets/fish/brand2.png";
import brd3 from "../../../assets/fish/brand3.png";
import brd4 from "../../../assets/fish/brand4.png";
import brd5 from "../../../assets/fish/brand5.png";

export default function Brands() {
  const brands = [brd, brd2, brd3, brd4, brd5];

  return (
    <section className="w-full bg-white py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Title */}
        <h3 className="text-blue-500 uppercase text-xl sm:text-2xl md:text-3xl font-semibold underline mb-8">
          Shop By Brands:
        </h3>

        {/* Brand Logos - single column */}
        <div className="flex flex-row items-center gap-6 flex-wrap sm:gap-10">
          {brands.map((brand, index) => (
            <img
              key={index}
              src={brand}
              alt={`Brand ${index + 1}`}
              className="w-16 sm:w-16 md:w-28 lg:w-32 object-contain hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
