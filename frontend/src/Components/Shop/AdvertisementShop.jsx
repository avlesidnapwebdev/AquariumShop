import React from "react";

export default function AdvertisementShop() {
  return (
    <>
    <div className="h-14 md:h-20 lg:h-20"></div>
    <section className="w-full bg-white p-10  px-4 md:px-8 lg:px-16">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {/* Purple Card */}
        <div className="w-full md:w-1/2 lg:w-[500px] h-[220px] sm:h-[250px] bg-gradient-to-br from-purple-600 to-purple-300 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center px-6">
          <p className="text-lg sm:text-xl font-semibold text-white mb-2">
            Exclusive Betta Fish Deals
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
            UP TO 30% OFF
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-2">
            Free Shipping on All Betta Fish
          </p>
          <p className="text-base sm:text-lg font-bold uppercase text-yellow-400">
            Limited Time Offer – Shop Now!
          </p>
        </div>

        {/* Blue Card */}
        <div className="w-full md:w-1/2 lg:w-[500px] h-[220px] sm:h-[250px] bg-gradient-to-br from-cyan-700 to-cyan-400 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center px-6">
          <p className="text-lg sm:text-xl font-semibold text-white mb-2">
            Healthy Foods for Happy Fish
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
            FLAT 20% OFF
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-2">
            Free Shipping on All Orders
          </p>
          <p className="text-base sm:text-lg font-bold uppercase text-yellow-400">
            Order Today & Save!
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
