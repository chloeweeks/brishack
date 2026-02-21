'use client';
import Canvas from "../src/components/canvas";
import Image from "next/image";
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


        <div className = "grid grid-rows-3 h-full">
          <div className="bg-gray-800">top row</div>
          <div className="bg-gray-800">middle row</div>
          <div className="bg-gray-800">bottom row</div>
        </div>

         {/* rectangle */}
        <div className="w-[80%] h-[70%] bg-white rounded-2xl flex flex-col text-black mx-auto">
          <h1 className = "text-2xl align-top font-bold text-black py-2 px-2">
          Star Name: 
          </h1>
          <div className="flex items-center justify-center py-2">
            <Image 
            src = "/star.png"
            alt = "star image"
            width = {240}
            height = {240}
            className = "my-2"
            />
            </div>

           <h2 className = "text-2xl align-top font-bold text-black py-2 px-2">
          Mass: 
          </h2>

           <h2 className = "text-2xl align-top font-bold text-black py-2 px-2">
          Magnitude: 
          </h2>

           <h2 className = "text-2xl align-top font-bold text-black py-2 px-2">
          Distance: 
          </h2>

           <h2 className = "text-2xl align-top font-bold text-black py-2 px-2">
          Spectral Type: 
          </h2>

        </div>
         {/* end of rectangle */}
      
      </div>


    </div>
  );
}
