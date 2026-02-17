import React, { useState } from "react";
import Header from "../Main/Header.jsx";
import Hero from "../Components/Home/Hero.jsx";
import CategorySection from "../Components/Home/Category.jsx";
import BannerSection from "../Components/Home/BannerSection.jsx";
import AdvertisementFish from "../Components/Home/Advertisement/AdvertisementFish.jsx";
import Fish from "../Components/Home/Bestselling/Fish.jsx";
import Hunt from "../Components/Home/Bestselling/Hunt.jsx";
import Tank from "../Components/Home/Bestselling/Tank.jsx";
import Food from "../Components/Home/Bestselling/Food.jsx";
import Coral from "../Components/Home/Bestselling/Coral.jsx";
import AdvertisementTank from "../Components/Home/Advertisement/AdvertisementTank.jsx";
import AdvertisementHunt from "../Components/Home/Advertisement/AdvertisementHunt.jsx";
import AdvertisementFood from "../Components/Home/Advertisement/AdvertisementFood.jsx";
import AdvertisementCoral from "../Components/Home/Advertisement/AdvertisementCoral.jsx";
import Brands from "../Components/Home/Advertisement/Brands.jsx";
import Footer from "../Main/Footer.jsx";

export default function Home({ isLoggedIn, username, onLogout }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      {/* ✅ Pass down login props to Header */}
      <Header
        query={query}
        setQuery={setQuery}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={onLogout}
      />

      {/* ✅ Page Sections */}
      <Hero />
      <CategorySection />
      <BannerSection />

      {/* Advertisements + Best Selling */}
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

      {/* Brands */}
      <Brands />

      {/* Footer */}
      <Footer />
    </div>
  );
}
