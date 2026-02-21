'use client';
import Button from "../components/ui/Button";
import Canvas from "../src/components/canvas";


export default function Home() {
  return (
    <div className="grid grid-cols-[70%_30%] h-screen bg-black">
      {/* Left column */}
      {/* Right column split into 2 rows */}
      <div className="grid grid-rows-[80%_20%] border-r border-white">
        <Canvas/>
      </div>

      <div className="border-l border-white">
        <h1 className="text-2xl text-center font-semibold tracking-tight text-white">
          matches:
        </h1>
      
      </div>

    </div>
  );
}
