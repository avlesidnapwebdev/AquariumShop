import React from "react";
import Goldfish from "../../assets/fish/goldfish.png";
import Fishtank from "../../assets/fishtank.png";
import Delivery from "../../assets/fish/service-icon-1.png";

const features = [
  { id: 1, img: Goldfish, text: "Fish Care Easy", size: "w-16" },
  { id: 2, img: Fishtank, text: "Tank Safe Free Delivery", size: "w-14" },
  { id: 5, img: Delivery, text: "Home Free Delivery", size: "w-12" },
];

export default function PromiseDelivery() {
  return (
    <section className="w-full bg-gray-50 text-black flex items-center justify-center py-8 md:py-12 lg:py-16">
      <div className="w-[90%] lg:w-4/5 border border-dashed border-black flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center justify-center gap-6 lg:gap-10 p-4 lg:p-6">
        {features.map(({ id, img, text, size }, index) => (
          <React.Fragment key={id}>
            {/* Feature Item */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-[250px] justify-center">
              <img src={img} alt={text} className={`${size} sm:w-16`} />
              <span className="text-sm sm:text-base md:text-lg font-medium max-w-[160px] text-center sm:text-left">
                {text}
              </span>
            </div>

            {/* Divider only on large screens */}
            {index !== features.length - 1 && (
              <hr className="hidden lg:block border border-dashed border-black h-12" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
