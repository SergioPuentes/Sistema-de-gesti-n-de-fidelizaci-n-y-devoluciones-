import Hero from "../components/Hero";
import ShoeCarousel from "../components/ShoeCarousel";
import InfoMapSection from "../components/InfoMapSection";

export default function Home() {
  return (
    <div className="contenedor1">
      <Hero />
      <div className="separator"></div>
      <ShoeCarousel />
      <InfoMapSection />
    </div>
  );
}
