import { useEffect, useState } from "react";
import zapato1 from "../assets/zapatos1.png";
import zapato2 from "../assets/zapatos2.png";
import zapato3 from "../assets/zapatos3.png";
import zapato4 from "../assets/zapatos4.png";
import zapato5 from "../assets/zapatos5.png";
import zapato6 from "../assets/zapatos6.png";

const images = [zapato1, zapato2, zapato3, zapato4, zapato5, zapato6];

export default function ShoeCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getVisibleImages = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(images[(index + i) % images.length]);
    }
    return result;
  };

  return (
    <div className="shoe-carousel">
      <div className="shoe-carousel-track">
        {getVisibleImages().map((img, i) => (
          <img key={i} src={img} alt={`Shoe ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}