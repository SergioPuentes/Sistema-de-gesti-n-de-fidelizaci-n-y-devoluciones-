import React from "react";
import banner from "../assets/banner.jpg";

export default function Hero() {
  return (
    <div className="section relative w-full h-[500px] hero" >
      <img
        src={banner}
        alt="Spring Step Medellín"
        className="w-full h-full object-cover hero__img"
      />
      <div className="hero__overlay">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
          Spring Step 
        </h1>
      </div>
    </div>
  );
}