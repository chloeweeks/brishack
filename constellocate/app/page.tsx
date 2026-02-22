'use client';

import { useEffect, useState } from "react"; // Added useState
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "./components/ui/Button";
import { StarfieldBackground } from "./src/components/star-background";

export default function Home() {
  const router = useRouter();
  
  // 1. Create a state for the GIF source
  const [gifSrc, setGifSrc] = useState("animated_logo.GIF");

  useEffect(() => {
    // 2. When the page loads, force a "fresh" version by adding a timestamp
    // This tricks the browser into thinking it's a brand new file
    setGifSrc(`animated_logo.GIF?t=${Date.now()}`);

    const handleScroll = () => {
      const scrollAmount = window.scrollY;
      if (scrollAmount > 2) {
        router.push('/draw');
      }
      if (scrollAmount > 10) {
        window.scrollTo(0, 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  return (
    <div className="relative flex h-[150vh] items-start justify-center font-sans overflow-x-hidden">
      <StarfieldBackground/>

      <main className="sticky top-0 z-10 flex h-screen w-full flex-col items-center justify-between py-20 px-16">
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <Button text={'Credits'} onClick={() => router.push('/credits')} size="sm"/>
          <Button 
            text={'?'} 
            size="sm" 
            className="!w-10 !h-8 !p-0 flex items-center justify-center rounded-full" 
            onClick={() => router.push('/help')} 
          />
        </div>

        <div className="flex flex-col items-center gap-6 text-center py-6 mt-20">
          {/* 3. Use the state variable here instead of the static string */}
          <img src={gifSrc} width="500" alt="Animated Logo" />
          
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-white">
            Start doodling and see which stars make up your drawing! 
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 mb-10">
          <p className="text-zinc-400 text-sm animate-bounce">↓ Scroll to start</p>
        </div>
      </main>
    </div>
  );
}