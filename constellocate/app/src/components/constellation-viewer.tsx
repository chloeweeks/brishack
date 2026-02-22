
import { useEffect, useRef, useState } from "react";
import { Point } from "../lib/douglas-peucker";
import { starList } from "../data/stars";
import Button from "@/app/components/ui/Button";
import { House } from 'lucide-react';


interface ConstellationProps {
  stars: { hips: number[]; vertices: Point[]; data3D?: any[]; };
}

const SPECTRAL_COLORS: Record<string, string> = {
  O: "#9bb0ff", // Deep Blue
  B: "#aabfff", // Blue-White
  A: "#cad7ff", // White
  F: "#f8f7ff", // Yellow-White
  G: "#fff4ea", // Yellow (Our Sun)
  K: "#ffd2a1", // Orange
  M: "#ffcc6f", // Red-Orange
};

const LUMINOSITY_SIZES: Record<string, number> = {
  I: 2.5,   // Supergiant (Large)
  II: 2.0,  // Bright Giant
  III: 1.5, // Giant
  IV: 1.2,  // Subgiant
  V: 1.0,   // Main Sequence (Standard)
};

const SPECTRAL_STRING: Record<string, string> = {
  O: "Deep Blue",
  B: "Blue-White",
  A: "White",
  F: "Yellow-White",
  G: "Yellow (Our Sun)",
  K: "Orange",
  M: "Red-Orange",
};

const LUMINOSITY_STRING: Record<string, string> = {
  I: "Supergiant",
  II: "Bright Giant",
  III: "Giant",
  IV: "Subgiant",
  V: "Main Sequence (Standard)",
};

function convertSpType(spType: string, firstLetter: string, roman: string) {
  if (!spType) return { color: "#ffffff", sizeMult: 1 };

  const colour = SPECTRAL_COLORS[firstLetter] || "#ffffff";
  const sizeMult = LUMINOSITY_SIZES[roman] || 1.0;

  return { colour, sizeMult };
}

export default function Constellation({ stars }: ConstellationProps) {

  console.log("Data inside viewer:", stars);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleGoTo3D = () => {
    if (stars.data3D) {
      // 1. Save the attached 3D data to memory
      sessionStorage.setItem('constellationData', JSON.stringify(stars.data3D));
      // 2. Teleport to the map page
      window.location.href = '/map';
    } else {
      alert("3D data is not available for this shape!");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle High DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    const count = Math.min(stars.hips.length, stars.vertices.length);

    // Draw Connection Path
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < count; i++) {
      const x = stars.vertices[i].x * rect.width;
      const y = stars.vertices[i].y * rect.height;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Stars
    for (let i = 0; i < count; i++) {
      const match = starList[i].spType.match(/\b(VII|VI|IV|V|III|II|I)\b/);
      const roman = match ? match[0] : "V";
      const firstLetter = starList[i].spType.charAt(0).toUpperCase();
      const colourString = SPECTRAL_STRING[firstLetter] || "White";
      const { colour, sizeMult } = convertSpType(starList[i].spType, firstLetter, roman);

      const v = stars.vertices[i];
      const x = v.x * rect.width;
      const y = v.y * rect.height;
      const isHovered = hoveredIndex === i;

      // Draw the Star Dot
      const baseSize = Math.max(3, 10 - starList[i].vmag);
      const finalSize = baseSize * sizeMult;

      ctx.beginPath();
      ctx.arc(x, y, finalSize, 0, Math.PI * 2);
      ctx.fillStyle = colour ? colour : "#f8f7ff";
      ctx.fill();

      // Draw Information if hovered
      if (isHovered) {
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(`HIP: ${stars.hips[i]}`, x, y - 15);
        ctx.font = "10px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(`SpType: ${LUMINOSITY_STRING[roman]}, Vmag: ${colourString}`, x, y + 20);
      } else {
        // Normal small label
        ctx.font = "9px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.textAlign = "center";
        ctx.fillText(stars.hips[i].toString(), x, y + 12);
      }
    }
  }, [stars, hoveredIndex]);

  // Handle Mouse Movement to detect "hits"
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let foundIndex = null;
    const hitRadius = 15; // Makes it easier to hover

    for (let i = 0; i < stars.vertices.length; i++) {
      const v = stars.vertices[i];
      const starX = v.x * rect.width;
      const starY = v.y * rect.height;

      const distance = Math.sqrt((mouseX - starX) ** 2 + (mouseY - starY) ** 2);
      if (distance < hitRadius) {
        foundIndex = i;
        break;
      }
    }
    setHoveredIndex(foundIndex);
  };

  return (
    <main>
      <div className="relative cursor-crosshair overflow-hidden h-screen">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
          className="absolute inset-0 w-full h-full z-10"
        />
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
          <div className="mt-auto pb-2 relative z-10 grid grid-cols-3 gap-5 mx-auto">            
            <Button
              text={'Draw Again!'}
              onClick={() => (window.location.href = '/draw')}
            />
            <Button
              text={'View in 3D'}
              onClick={handleGoTo3D}
            />
          </div>
        </div>
         <div className="absolute top-8 right-8 flex items-center gap-4 z-20">
                <Button 
                  icon={House}
                  size="sm" 
                  className="!w-10 !h-10 !p-0 flex items-center justify-center rounded-full" 
                  onClick={() => (window.location.href='/')} 
                />
              </div>
      </div>
    </main>
  );
}
