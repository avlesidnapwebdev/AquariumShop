import React, { useState } from "react";
import Header from "../Main/Header.jsx";
import Hero from "../Components/Home/Hero.jsx";
import CategorySection from "../Components/Home/Category.jsx";
import BannerSection from "../Components/Home/BannerSection.jsx";
import AdvertisementFish from "../Components/Home/Advertisement/AdvertisementFish";
import Fish from "../Components/Home/BestSelling/Fish.jsx";
import Hunt from "../Components/Home/BestSelling/Hunt.jsx";
import Tank from "../Components/Home/BestSelling/Tank.jsx";
import Food from "../Components/Home/BestSelling/Food.jsx";
import Coral from "../Components/Home/BestSelling/Coral.jsx";
import AdvertisementTank from "../Components/Home/Advertisement/AdvertisementTank.jsx";
import AdvertisementHunt from "../Components/Home/Advertisement/AdvertisementHunt.jsx";
import AdvertisementFood from "../Components/Home/Advertisement/AdvertisementFood.jsx";
import AdvertisementCoral from "../Components/Home/Advertisement/AdvertisementCoral.jsx";
import Brands from "../Components/Home/Advertisement/Brands.jsx";
import Footer from "../Main/Footer.jsx";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <Header query={query} setQuery={setQuery} />
      <Hero />
      <CategorySection />
      <BannerSection />
      <AdvertisementFish />
      <Fish />
      <AdvertisementHunt />
      <Hunt />
      <AdvertisementTank />
      <Tank />
      <AdvertisementFood />
      <Food />
      <AdvertisementCoral />
      <Coral />
      <Brands />
      <Footer />
    </div>
  );
}
