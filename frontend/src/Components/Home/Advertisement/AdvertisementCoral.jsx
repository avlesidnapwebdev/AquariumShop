import React from "react";
import cf5 from "/assets/fish/fishbg/coral reef 5.webp";
import { Link } from "react-router-dom"; 

export default function AdvertisementCoral() {
  return (
    <section className="w-full bg-white py-10 md:py-7">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-6">
        
        {/* Left Content */}
        <div className="flex flex-col md:w-1/2 space-y-6">
          <div className="space-y-2">
            <span className="text-xl md:text-2xl font-semibold text-blue-500 leading-tight">
              Colorful Collection
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#19063C] leading-snug max-w-xl">
              Beautiful Corals for Your Aquarium
            </h1>
          </div>

          {/* ✅ Fixed paragraph + button layout */}
          <div className="flex flex-col gap-4">
            <p className="text-base md:text-lg text-black font-normal leading-relaxed">
              Add vibrant corals to make your tank lively and stunning.
            </p>
            <Link
              to="/Shop?category=Coral" // ✅ redirects with Coral filter
              className="bg-blue-500 text-white uppercase font-extrabold px-6 py-3 text-sm rounded-full transition-all duration-300 hover:bg-[#E0F7FA] hover:text-[#003B73] hover:scale-105 w-max"
            >
              Shop Coral
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:w-1/3">
          <img
            src={cf5}
            alt="Coral Reef"
            className="w-72 sm:w-96 md:w-[500px] lg:w-[600px] rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
