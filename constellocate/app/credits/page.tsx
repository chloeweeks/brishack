'use client';

import Image from "next/image";
import Button from "../components/ui/Button";
import { StarfieldBackground } from "../src/components/star-background";

export default function Credits() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">

      <StarfieldBackground/>
      <main className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-40 px-16">
        
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="items-center text-4xl font-semibold leading-10 tracking-tight text-white">
             Creators 
          </h1>
        <div className="flex gap-4 items-center justify-center">
            <img src="katie.jpeg" className="w-40 h-auto"></img>
            <img src="jake.jpeg" className="w-40 h-auto"></img>
            <img src="chloe.jpeg" className="w-40 h-auto"></img>
            <img src="max.jpeg" className="w-40 h-40"></img>
            <img src="ritika.jpeg" className="w-40 h-auto"></img>
        </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    
         <Button text={'Back'} onClick={() => (window.location.href = '/')} />
        </div>
      </main>
    </div>
  );
}