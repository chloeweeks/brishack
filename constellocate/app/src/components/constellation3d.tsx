"use client";

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import { starList } from '../data/stars';

const SPECTRAL_COLORS: Record<string, string> = {
    O: "#9bb0ff",
    B: "#aabfff",
    A: "#cad7ff",
    F: "#f8f7ff",
    G: "#fff4ea",
    K: "#ffd2a1",
    M: "#ffcc6f",
};

const LUMINOSITY_SIZES: Record<string, number> = {
    I: 2.5,
    II: 2.0,
    III: 1.5,
    IV: 1.2,
    V: 1.0,
};

function convertSpType(spType: string, firstLetter: string, roman: string) {
    if (!spType) return { colour: "#ffffff", sizeMult: 1 };
    const colour = SPECTRAL_COLORS[firstLetter] || "#ffffff";
    const sizeMult = LUMINOSITY_SIZES[roman] || 1.0;
    return { colour, sizeMult };
}

interface Star {
    hip: number;
    x: number;
    y: number;
    z: number;
    vmag: number;
}

interface ConstellationProps {
    starData: Star[];
}

export default function Constellation3D({ starData }: ConstellationProps) {

    const { normalizedStars, linePoints } = useMemo(() => {
        if (!starData || starData.length === 0) return { normalizedStars: [], linePoints: [] };

        let avgX = 0, avgY = 0, avgZ = 0;
        starData.forEach(s => { avgX += s.x; avgY += s.y; avgZ += s.z; });
        avgX /= starData.length;
        avgY /= starData.length;
        avgZ /= starData.length;

        const centerVec = new THREE.Vector3(avgX, avgY, avgZ).normalize();
        const zAxis = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(centerVec, zAxis);

        const rotatedStars = starData.map(star => {
            const vec = new THREE.Vector3(star.x, star.y, star.z);
            vec.applyQuaternion(quaternion);
            return { ...star, x: vec.x, y: vec.y, z: vec.z };
        });

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
        rotatedStars.forEach(star => {
            if (star.x < minX) minX = star.x;
            if (star.x > maxX) maxX = star.x;
            if (star.y < minY) minY = star.y;
            if (star.y > maxY) maxY = star.y;
            if (star.z < minZ) minZ = star.z;
            if (star.z > maxZ) maxZ = star.z;
        });

        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const cz = (minZ + maxZ) / 2;

        const rangeX = maxX - minX;
        const rangeY = maxY - minY;
        const maxXY = Math.max(rangeX, rangeY);

        const xyScale = maxXY > 0 ? 100 / maxXY : 1;
        const zScale = xyScale * 0.15;

        const normalized = rotatedStars.map(star => {
            const realStar = starList.find((s) => s.hip === star.hip);
            const spType = realStar?.spType || "G V";

            const match = spType.match(/\b(VII|VI|IV|V|III|II|I)\b/);
            const roman = match ? match[0] : "V";
            const firstLetter = spType.charAt(0).toUpperCase();

            const { colour, sizeMult } = convertSpType(spType, firstLetter, roman);

            const baseSize = Math.max(0.5, 5 - star.vmag);
            const finalSize = baseSize * sizeMult * 0.8;
            const glowIntensity = Math.max(1.5, 6 - star.vmag);

            return {
                ...star,
                x: (star.x - cx) * xyScale,
                y: (star.y - cy) * xyScale,
                z: (star.z - cz) * zScale,
                colour: colour,
                size: finalSize,
                glowIntensity: glowIntensity
            };
        });

        const points = normalized.map((star) => new THREE.Vector3(star.x, star.y, star.z));
        points.push(new THREE.Vector3(normalized[0].x, normalized[0].y, normalized[0].z));

        return { normalizedStars: normalized, linePoints: points };
    }, [starData]);

    if (!starData || starData.length === 0) {
        return <div className="text-white flex items-center justify-center w-full h-full">Loading 3D Map...</div>;
    }

    return (
        <div className="w-full h-full bg-[#020208]">
            <Canvas camera={{ position: [0, 0, 150], fov: 60 }}>
                <Stars radius={300} depth={50} count={8000} factor={3} saturation={1} fade speed={2} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="white" />

                <OrbitControls makeDefault enablePan={false} />

                {normalizedStars.map((star) => (
                    <Sphere key={star.hip} args={[star.size, 32, 32]} position={[star.x, star.y, star.z]}>
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive={star.colour}
                            emissiveIntensity={star.glowIntensity}
                            toneMapped={false}
                        />
                    </Sphere>
                ))}

                <Line
                    points={linePoints}
                    color="#44aaff"
                    lineWidth={1.5}
                    transparent
                    opacity={0.6}
                />

                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={1.2}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}