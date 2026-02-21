'use client';

import Image from "next/image";
import Button from "./components/ui/Button";
import { StarfieldBackground } from "./src/components/star-background";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">

      <StarfieldBackground/>
      <main className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-20 px-16">
        
        <div className="flex flex-col items-center gap-6 text-center py-6">
          <img src="/Constellocate logo.png" width="400"></img>
          <h1 className="items-center text-2xl font-semibold leading-10 tracking-tight text-white">
            Start doodling and see which stars make up your drawing! 
          </h1>
          {/* <p className="max-w-md text-lg leading-8 text-zinc-300 font-semibold">
            Start doodling and see which stars make up your drawing!
          </p> */}
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    
         <Button text={'Find Your Match'} onClick={() => (window.location.href = '/main')} />
         <Button text={'Need Help?'} onClick={() => (window.location.href = '/help')} />
         <Button text={'Credits'} onClick={() => (window.location.href = '/credits')} />
        </div>
      </main>
    </div>
  );
}
