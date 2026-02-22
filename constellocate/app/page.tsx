'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "./components/ui/Button";
import { StarfieldBackground } from "./src/components/star-background";

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

//   return (
//     <div className="flex min-h-screen items-center justify-center font-sans">

//       <StarfieldBackground/>

//       <main className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-20 px-16">
//         <div className="absolute top-8 right-8 flex items-center gap-4">
//         <Button text={'Credits'} onClick={() => (window.location.href = '/credits')} size="sm"/>
//           <Button 
//       text={'?'} 
//       size="sm" 
//       className="!w-10 !h-10 !p-0 flex items-center justify-center rounded-full" 
//       onClick={() => (window.location.href = '/help')} 
//       />
//     </div>
//         <div className="flex flex-col items-center gap-6 text-center py-6">
//           <img src="/Constellocate logo.png" width="500"></img>
//           <h1 className="items-center text-2xl font-semibold leading-10 tracking-tight text-white">
//             Start doodling and see which stars make up your drawing! 
//           </h1>
//           {/* <p className="max-w-md text-lg leading-8 text-zinc-300 font-semibold">
//             Start doodling and see which stars make up your drawing!
//           </p> */}
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row scale-80">
    
//          <Button text={'Start Drawing'} onClick={() => (window.location.href = '/draw')} size="lg"/>
  
//         </div>
//       </main>
//     </div>
//   );
// }

return (
  /* We add h-[150vh] to ensure there is space to actually scroll */
  <div className="relative flex h-[150vh] items-start justify-center font-sans overflow-x-hidden">
    
    <StarfieldBackground/>

    {/* Sticky container so the UI stays put while the user scrolls "under" it */}
    <main className="sticky top-0 z-10 flex h-screen w-full max-w-3xl flex-col items-center justify-between py-20 px-16">
      <div className="absolute top-8 right-8 flex items-center gap-4">
        <Button text={'Credits'} onClick={() => router.push('/credits')} size="sm"/>
        <Button 
          text={'?'} 
          size="sm" 
          className="!w-10 !h-10 !p-0 flex items-center justify-center rounded-full" 
          onClick={() => router.push('/help')} 
        />
      </div>

      <div className="flex flex-col items-center gap-6 text-center py-6 mt-20">
        <img src="/Constellocate logo.png" width="500" alt="Logo" />
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-white">
          Start doodling and see which stars make up your drawing! 
        </h1>
      </div>

      <div className="flex flex-col items-center gap-4 mb-10">
        {/* <Button text={'Start Drawing'} onClick={() => router.push('/draw')} size="lg"/> */}
        <p className="text-zinc-400 text-sm animate-bounce">↓ Scroll to start</p>
      </div>
    </main>
  </div>
);
}