'use client';
import Button from "../components/ui/Button";


export default function Home() {
  return (
    <div className="grid grid-cols-[70%_30%] h-screen bg-black">
      {/* Left column */}
      {/* Right column split into 2 rows */}
      <div className="grid grid-rows-[80%_20%] border-r border-white">
        <div className="border-b border-white">
            <h1 className="text-lg text-left font-semibold tracking-tight text-white">
          Start drawing:
        </h1>
          drawing screen
        </div>
        <div className = "grid grid-cols-3 w-full gap-4 py-4 px-4">
         
           <Button text={'Submit'} onClick={() => (window.location.href = '/load-page')}
           className="w-full h-full bg-white text-black rounded-lg" />
           <Button text={'Undo'} 
           className="w-full h-full bg-white text-black rounded-lg" />
           <Button text={'Clear'}
           className="w-full h-full bg-white text-black rounded-lg" />
           </div>
      </div>

      <div className="border-l border-white">
        <h1 className="text-2xl text-center font-semibold tracking-tight text-white">
          matches:
        </h1>
      
      </div>

    </div>
  );
}
