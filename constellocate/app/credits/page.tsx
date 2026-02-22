
'use client';

import Image from "next/image";
import Button from "../components/ui/Button";
import { StarfieldBackground } from "../src/components/star-background";
import { House } from 'lucide-react';

export default function Credits() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">

      <StarfieldBackground/>
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-between py-40 px-16">
      <div className="absolute top-8 right-8 flex items-center gap-4 z-20">
                <Button icon={House} size="sm" onClick={()=> (window.location.href = '/')}/>
                <Button 
                                text={'?'} 
                                size="sm" 
                                className="!w-10 !h-8 !p-0 flex items-center justify-center rounded-full" 
                                onClick={() =>(window.location.href = '/help')} 
                              />
            </div>
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="items-center text-4xl font-semibold leading-10 tracking-tight text-white">
             Creators 
          </h1>
        <div className="flex gap-4 items-center justify-center">
            <a href="https://www.linkedin.com/in/katie-young-b8b647269/"><img src="katie.jpeg" className="w-200 h-auto"></img></a>
            <a href="https://www.linkedin.com/in/jake-snee-606610301/"><img src="jake.jpeg" className="w-200 h-auto"></img></a>
            <a href="https://www.linkedin.com/in/chloe-weeksuob/"><img src="chloe.jpeg" className="w-200 h-auto"></img></a>
            <a href="https://www.linkedin.com/in/max-dv/" className="w-200 h-auto"><img src="max.jpg"></img></a>
            <a href="https://www.linkedin.com/in/ritika-c-8843b2240/"><img src="ritika.jpeg" className="w-200 h-auto"></img></a>
        </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    
        </div>
      </main>
    </div>
  );
}
