'use client';
import Canvas from "../src/components/canvas";
import Image from "next/image";
import { StarfieldBackground } from "../src/components/star-background";
import { useState } from "react";
import { Point } from "../src/lib/douglas-peucker";
import { calcVertices } from "../src/lib/vertices";
import Button from "../components/ui/Button";

export default function Home() {
  const [showButtons, setShowButtons] = useState(true);



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

  const data = await res.json() as {star: string, pos: {x: number, y: number}}[];
  console.log(data);

  return data;
}

  return (
    /*splitting into two rows */
    <div className="grid grid-cols-[70%_30%] h-screen bg-black">
    
      {/* Left column */}
      {/* Right column split into 2 rows */}
      <div className="relative grid grid-rows-[80%_20%] border-r border-white">
        <StarfieldBackground/>
        
        <Canvas onSubmit={handleSubmit}/>
      </div>

      {/* RIGHT COLUMN */}
      <div className="relative place-items-center">
        <h1 className="text-2xl text-center font-semibold tracking-tight text-white">
          matches:
        </h1>

        <div className="h-screen w-full p-4 align-center justify-center ">

          {showButtons ? (
            /* SHOW THE 3 BUTTONS */
           <div className="grid grid-rows-3 h-full w-[90%] align-center mx-auto">  
         
              <Button
                text="Star 1"
                onClick={() => setShowButtons(false)}
                className="font-semibold cursor-pointer whitespace-nowrap flex h-[90%] w-full text-black items-center justify-center gap-2 rounded-xl px-5 text-background transition-colors hover:bg-gray-300 bg-white hover:shadow-[0_0_35px_rgba(99,102,241,1)]"
              />

              <Button
                text="Star 2"
                onClick={() => setShowButtons(false)}
                className="font-semibold cursor-pointer whitespace-nowrap flex h-[90%] w-full text-black items-center justify-center gap-2 rounded-xl px-5 text-background transition-colors hover:bg-gray-300 bg-white hover:shadow-[0_0_35px_rgba(99,102,241,1)]"
              />

              <Button
                text="Star 3"
                onClick={() => setShowButtons(false)}
                className="font-semibold cursor-pointer whitespace-nowrap flex h-[90%] w-full text-black items-center justify-center gap-2 rounded-xl px-5 text-background transition-colors hover:bg-gray-300 bg-white hover:shadow-[0_0_35px_rgba(99,102,241,1)]"
              />
              </div>
          ) : (
            /* SHOW THE RECTANGLE + BUTTON */
            <>
              <div className="w-[90%] h-[80%] bg-white rounded-2xl flex flex-col text-black mx-auto">
                <h1 className="text-2xl font-bold py-2 px-2">Star Name:</h1>

                <div className="flex items-center justify-center py-2">
                  <Image
                    src="/star.png"
                    alt="star image"
                    width={240}
                    height={240}
                    className="my-2"
                  />
                </div>

                <h2 className="text-2xl font-bold py-2 px-2">Mass:</h2>
                <h2 className="text-2xl font-bold py-2 px-2">Magnitude:</h2>
                <h2 className="text-2xl font-bold py-2 px-2">Distance:</h2>
                <h2 className="text-2xl font-bold py-2 px-2">Spectral Type:</h2>
              </div>

             <div className="w-[90%] mx-auto mt-4">
              <Button
                text="See my stars"
                onClick={() => setShowButtons(true)}
                className="font-semibold cursor-pointer whitespace-nowrap flex h-[60px] w-full text-black items-center justify-center gap-2 rounded-xl px-5 text-background transition-colors hover:bg-gray-300 bg-white hover:shadow-[0_0_35px_rgba(99,102,241,1)]"
              />
            </div>
            </>
          )}

        </div>
      </div>
    </div>
  );

}
