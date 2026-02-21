import { useEffect, useRef } from "react";
import { Point } from "../lib/douglas-peucker";

interface ConstellationProps {
    stars: {hips: number[], vertices: Point[]},
}

export default function Constellation({ stars }: ConstellationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, rect.width, rect.height);

  const count = Math.min(stars.hips.length, stars.vertices.length);
  if (count === 0) return;

  // --- 1. Draw the Path (Connect the dots) ---
  ctx.beginPath();
  ctx.strokeStyle = "rgba(100, 160, 240, 0.3)"; // Faint blue/white line
  ctx.lineWidth = 1;
  ctx.lineJoin = "round";

  for (let i = 0; i < count; i++) {
    const v = stars.vertices[i];
    const x = v.x * rect.width;
    const y = v.y * rect.height;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // --- 2. Draw Stars and Labels ---
  for (let i = 0; i < count; i++) {
    const vertex = stars.vertices[i];
    const x = vertex.x * rect.width;
    const y = vertex.y * rect.height;

    // Draw star (Circle)
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Draw ID (Small and offset)
    ctx.font = "10px Inter, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(stars.hips[i].toString(), x, y + 15); // Offset below the dot
  }
}, [stars]);

  return (
        <div className="relative cursor-crosshair overflow-hidden h-screen">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10"/>
        </div>
    )
}