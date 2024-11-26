import React, { useState } from "react";
import ImageFilter from "../Filter/ImageFilter";
import Hero from "./Hero";
import About from './About';
const HomePage = () => {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <ImageFilter />
      <About />
    </div>
  );
};

export default HomePage;
