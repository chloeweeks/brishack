import { useEffect, useRef } from "react";

interface ConstellationProps {
    stars: {star: string, pos: {x: number, y: number}}[],
}

export default function Constellation({ stars }: ConstellationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each label
    ctx.fillStyle = "#fff"; // white text
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    stars.forEach((star) => {
      ctx.fillText(star.star, star.pos.x, star.pos.y);
    });
  }, [stars]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10"/>;
}