
'use client';

import Image from "next/image";
import Button from "../components/ui/Button";
import { StarfieldBackground } from "../src/components/star-background";
import { House } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollAmount = window.scrollY
        // If the user scrolls down even a little bit (more than 10px)
        if (scrollAmount > 2) {
          router.push('/draw');
        }
  
        if (scrollAmount > 10) {
          window.scrollTo(0, 10);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      // Cleanup listener on unmount
      return () => window.removeEventListener("scroll", handleScroll);
    }, [router]);
  
    return (
      <div className="relative flex h-[150vh] items-start justify-center font-sans overflow-x-hidden">
        <StarfieldBackground />
    
        <main className="sticky top-0 z-10 flex h-screen w-full max-w-3xl flex-col items-center justify-between py-20 px-16">
          
          {/* Top Navigation Row */}
          <div className="absolute top-8 right-8 flex items-center gap-4">
            <Button text={'Credits'} onClick={() => router.push('/credits')} size="sm"/>
            <Button icon={House} size="sm" onClick={()=> (window.location.href = '/')}/>
          </div>
    
          {/* Instructions Section (Centered) */}
          <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white">
               Instructions 
            </h1>
            
            <ul className="max-w-md space-y-4 text-left text-xl leading-relaxed text-zinc-300 font-medium list-disc list-inside">
              <li>Draw an image on the canvas</li>
              <li>Submit your image</li>
              <li>See the stars that make up your constellation!</li>
            </ul>
          </div>
    
          {/* Bottom Hint */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <p className="text-zinc-500 text-sm animate-bounce">↓ Scroll down to start drawing</p>
          </div>
    
        </main>
      </div>
    );
}
