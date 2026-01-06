import React from "react";
// import betaFish from "/assets/fish/beta_fish-Banner.png";
// import FoodFish from "/assets/fish/Foods_Banner.png";
// import Decoration from "/assets/fish/Decoration_Banner.png";
// import FishPole from "/assets/fish/Fishpole_Banner.png";
import { Link } from "react-router-dom";
 
const banners = [
  {
    id: 1,
    title: "free shipping Betta Fish",
    discount: "30%",
    sub: "sale off",
    img: "/assets/fish/beta_fish-Banner.png",
    gradient: "bg-gradient-to-tr from-[#856ebf] to-[#baabe8]",
    category: "Fish", // ✅ category filter
  },
  {
    id: 2,
    title: "free shipping Foods",
    discount: "20%",
    sub: "sale off",
    img: "/assets/fish/Foods_Banner.png",
    gradient: "bg-gradient-to-tr from-[#017faf] to-[#5298bc]",
    category: "Food", // ✅ category filter
  },
  {
    id: 3,
    title: "free shipping Decoration",
    discount: "55%",
    sub: "Ends Today",
    img: "/assets/fish/Decoration_Banner.png",
    gradient: "bg-gradient-to-tr from-[#e7bc56] to-[#e4c57b]",
    category: "Decoration", // ✅ category filter
  },
  {
    id: 4,
    title: "free shipping Fishpole",
    discount: "40%",
    sub: "sale off",
    img: "/assets/fish/Fishpole_Banner.png",
    gradient: "bg-gradient-to-tr from-[#9b8f7f] to-[#9b8f7f]",
    category: "Hunt", // ✅ mapped as Fishpole → Hunt
  },
];

export default function BannerSection() {
  return (
    <section className="w-full bg-[#f6f8fb] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold underline uppercase mb-8 md:mb-12 text-left xl:text-2xl text-blue-600">
          Offers On:
        </h3>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {banners.map(({ id, title, discount, sub, img, gradient, category }) => (
            <div
              key={id}
              className={`${gradient} w-full h-auto rounded-2xl shadow-md flex items-center justify-between p-4`}
            >
              {/* Text Section */}
              <div className="flex flex-col items-center text-center gap-1 flex-1">
                <span className="text-white text-xs md:text-sm font-bold uppercase">
                  {title}
                </span>
                <h1 className="flex flex-col text-center text-white font-extrabold text-2xl md:text-3xl lg:text-4xl leading-tight">
                  {discount}
                  <span className="text-sm md:text-lg">{sub}</span>
                </h1>
                <Link
                  to={`/Shop?category=${encodeURIComponent(category)}`} // ✅ pass filter
                  className="px-2 py-1 text-xs md:text-sm font-bold uppercase bg-[#6839cc] text-white rounded-full transition-transform duration-300 hover:bg-[#e0f7fa] hover:text-[#003b73] hover:scale-105"
                >
                  Shop now
                </Link>
              </div>

              {/* Image Section */}
              <div className="flex-shrink-0">
                <img
                  src={img}
                  alt={title}
                  className="w-20 md:w-28 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
