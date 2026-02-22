'use client';
import Canvas from "../src/components/canvas";
import Image from "next/image";
import { StarfieldBackground } from "../src/components/star-background";
import { useState } from "react";
import { Point } from "../src/lib/douglas-peucker";
import { calcVertices } from "../src/lib/vertices";
import Button from "../components/ui/Button";

export default function Home() {



async function writeVertices(vertices: Point[]) {
    const res = await fetch('/api/vertices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vertices),
    });

    if (!res.ok) {
      console.log('Error');
    }
}

async function handleSubmit(points: Point[]) {
  const vertices = calcVertices(points);
  writeVertices(vertices);
  
  const res = await fetch("/api/stars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vertices: vertices,
    }),
  });

  const data = await res.json() as {hips: number[], averageVmag: number}[];
  console.log(data);

  return { hips: data[0].hips, vertices: vertices };
}

  return (
    /*splitting into two rows */
    <div className="h-screen bg-black">
    
      {/* Left column */}
      {/* Right column split into 2 rows */}
      <div className="relative border-r border-white">
        <StarfieldBackground/>
        
        <Canvas onSubmit={handleSubmit}/>
      </div>

        <div className="h-screen w-full p-4 align-center justify-center ">
        </div>
      </div>
  );

}
