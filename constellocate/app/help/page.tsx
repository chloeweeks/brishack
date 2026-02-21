'use client';

import Image from "next/image";
import Button from "../components/ui/Button";
import { StarfieldBackground } from "../src/components/star-background";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">

      <StarfieldBackground/>
      <main className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-40 px-16">
        
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="items-center text-4xl font-semibold leading-10 tracking-tight text-white">
             Instructions 
          </h1>
          <ul className="max-w-md text-lg leading-8 text-zinc-300 font-semibold">
            <li>Draw an image on the canvas</li>
            <li>Submit your image</li>
            <li>See the stars that make up your constellation!</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    
         <Button text={'Find Your Match'} onClick={() => (window.location.href = '/main')} />
         <Button text={'Back'} onClick={() => (window.location.href = '/')} />
        </div>
      </main>
    </div>
  );
}