import React from "react";
import tank3 from '/assets/fish/tank/aqua 45k.png'
import { Link } from "react-router-dom"; 

export default function Advertisement({ 

}) {
  return (
    <section className="w-full bg-white py-10 md:py-7">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-6">
        
        {/* Left Content */}
        <div className="flex flex-col md:w-1/2 space-y-6">
          <div className="space-y-2">
            <span className="text-xl md:text-2xl font-semibold text-blue-500 leading-tight">
              Stylish Tanks
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#19063C] leading-snug max-w-2xl">
              Perfect Tanks for Your Aquatic World
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-base md:text-lg text-black font-normal leading-relaxed">
              Choose from modern aquariums, bowls, and large tanks.
            </p>
            <Link to="/Shop?category=Tank" className="bg-blue-500 text-white uppercase font-extrabold px-6 py-3 text-sm rounded-full transition-all duration-300 hover:bg-[#E0F7FA] hover:text-[#003B73] hover:scale-105 w-max">
              Shop Tanks
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:w-1/3">
          <img
            src={tank3}
            alt="Fish Food Banner"
            className="w-64 sm:w-80 md:w-[400px] lg:w-[500px]"
          />
        </div>
      </div>
    </section>
  );
}
