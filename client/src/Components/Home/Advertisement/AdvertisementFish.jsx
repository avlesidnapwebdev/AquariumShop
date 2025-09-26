import React from "react";
import Octo from "../../../assets/fish/octo.png";
import { Link } from "react-router-dom"; 

export default function AdvertisementFish() {
  return (
    <section className="w-full bg-white py-10 md:py-7 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-6">
        
        {/* Left Content */}
        <div className="flex flex-col md:w-1/2 space-y-6">
          <div className="space-y-2">
            <span className="text-xl md:text-2xl font-semibold text-blue-500 leading-tight">
              Fast Delivery
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#19063C] leading-snug max-w-2xl">
              Find Everything You Need for Fish
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-base md:text-lg text-black font-normal leading-relaxed">
              Wide collection of fresh and exotic fish for your aquarium.
            </p>
            <Link to="/Shop?category=Fish" className="bg-blue-500 text-white uppercase font-extrabold px-6 py-3 text-sm rounded-full transition-all duration-300 hover:bg-[#E0F7FA] hover:text-[#003B73] hover:scale-105 w-max">
              Shop Fish
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:w-1/3">
          <img
            src={Octo}
            alt="Octopus"
            className="w-64 sm:w-80 md:w-[400px] lg:w-[500px]"
          />
        </div>
      </div>
    </section>
  );
}
