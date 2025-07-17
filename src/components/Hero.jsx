import React from "react";
import banner from "../assets/banner.jpg";

export default function Hero() {
  return (
    <div className="section1  hero" >
      <img
        src={banner}
        alt="Spring Step Medellín"
        className="hero__img"
      />
      <div className="hero__overlay1">
        <h1 className="titulo">
          Spring Step 
          
        </h1>
      </div>
    </div>
  );
}