'use client';
import Image from "next/image";
import Canvas from "./src/components/canvas";
import { StarfieldBackground } from "./src/components/star-background";

export default function Home() {
  return (
    <div>
      <StarfieldBackground></StarfieldBackground>
      <Canvas/>
    </div>
  );
}
