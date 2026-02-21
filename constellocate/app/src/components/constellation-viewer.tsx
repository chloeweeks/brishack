import { useEffect, useRef, useState } from "react";
import { Point } from "../lib/douglas-peucker";

interface ConstellationProps {
  stars: { hips: number[]; vertices: Point[] };
}

export default function Constellation({ stars }: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

    // 1. Draw Connection Path
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < count; i++) {
      const x = stars.vertices[i].x * rect.width;
      const y = stars.vertices[i].y * rect.height;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Draw Stars
    for (let i = 0; i < count; i++) {
      const v = stars.vertices[i];
      const x = v.x * rect.width;
      const y = v.y * rect.height;
      const isHovered = hoveredIndex === i;

      // Draw the Star Dot
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? "#5de2ff" : "#fff";
      ctx.fill();

      // Draw Information if hovered
      if (isHovered) {
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(`HIP: ${stars.hips[i]}`, x, y - 15);
        ctx.font = "10px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(`x: ${v.x.toFixed(2)} y: ${v.y.toFixed(2)}`, x, y + 20);
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
    <div className="relative cursor-crosshair overflow-hidden h-screen">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        className="absolute inset-0 w-full h-full z-10"
      />
    </div>
  );
}