import React from "react";
import FishBg from "../../assets/fish/fish/Betta Fish.png";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-700 px-6 lg:px-16 py-20 lg:py-32 text-center lg:text-left min-h-screen gap-12">
      {/* Left: Image */}
      <div className="flex justify-center w-full lg:w-1/2">
        <img
          src={FishBg}
          alt="Betta Fish"
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl transform -scale-x-100"
        />
      </div>

      {/* Right: Content */}
      <div className="flex flex-col items-center lg:items-start w-full lg:w-1/2">
        <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-cyan-100 uppercase tracking-wide">
          Discover Colorful
        </span>

        <h1 className="font-extrabold text-white leading-tight mt-4 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
          Fresh Water <br />
          Fish
          <small className="block mt-3 text-base sm:text-lg lg:text-xl font-medium text-cyan-100 normal-case">
            Safe Delivery <br /> Happy Aqua’s
          </small>
        </h1>

        <Link
          to="/Shop"
          className="mt-8 px-8 py-3 rounded-full border-2 border-purple-400 bg-blue-900 text-white font-bold text-lg sm:text-xl hover:bg-cyan-100 hover:text-black hover:scale-105 transition-all duration-300"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
