'use client';
import Button from "../components/ui/Button";
import Canvas from "../src/components/canvas";
import Image from "next/image";
import { StarfieldBackground } from "../src/components/star-background";


export default function Home() {
  return (
   
    <div className="grid grid-cols-[70%_30%] h-screen bg-black">
    
      {/* Left column */}
      {/* Right column split into 2 rows */}
      <div className="grid grid-rows-[80%_20%] border-r border-white">
        <StarfieldBackground/>
        <Canvas/>
      </div>

      <div className="relative z-10 border-l border-white">
        <h1 className="text-2xl text-center font-semibold tracking-tight text-white">
          matches:
  
        </h1>

        {/* Left column */}
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
      
      </div>


    </div>
  );
}
