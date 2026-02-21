'use client';

import Image from "next/image";
import Button from "./components/ui/Button";
import { StarfieldBackground } from "./src/components/star-background";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <StarfieldBackground/>
      <main className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-40 px-16">
        
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="items-center text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
             CONSTELLOCATE 
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Start doodling and see which stars make up your drawing!
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    
         <Button text={'Find Your Match'} onClick={() => (window.location.href = '/main')} />
         <Button text={'Lost?'} onClick={() => (window.location.href = '/help')} />
        </div>
      </main>
    </div>
  );
}
