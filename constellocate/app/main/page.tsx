'use client';
import Canvas from "../src/components/canvas";
import { StarfieldBackground } from "../src/components/star-background";
import { Point } from "../src/lib/douglas-peucker";
import { calcVertices } from "../src/lib/vertices";

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
  console.log(vertices);
  writeVertices(vertices);
}

export default function Main() {
  return (
   
    <div className="grid grid-cols-[70%_30%] h-screen bg-black">
    
      {/* Left column */}
      {/* Right column split into 2 rows */}
      <div className="grid grid-rows-[80%_20%] border-r border-white">
        <StarfieldBackground/>
        <Canvas onSubmit={handleSubmit}/>
      </div>

      <div className="relative z-10 border-l border-white">
        <h1 className="text-2xl text-center font-semibold tracking-tight text-white">
          matches:
        </h1>
      
      </div>

    </div>
  );
}
