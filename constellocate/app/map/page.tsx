"use client";

import { useState, useEffect } from 'react';
import Constellation3D from '../src/components/constellation3d';
import Button from '../components/ui/Button';

export default function MapPage() {
    const [starData, setStarData] = useState([]);

    useEffect(() => {
        const savedData = sessionStorage.getItem('constellationData');

        if (savedData) {
            setStarData(JSON.parse(savedData));
        } else {
            console.log("No data found! Did you come directly to this URL without searching?");
        }
    }, []);

    return (
        <main className="bg-black w-screen h-screen overflow-hidden relative">

            <div className="absolute top-8 left-8 z-50">
                <Button text="← Back to 2D" onClick={() => (window.history.back())} size="sm" />
            </div>

            <div className="w-full h-full absolute inset-0">
                {starData.length > 0 ? (
                    <Constellation3D starData={starData} />
                ) : (
                    <div className="flex w-full h-full items-center justify-center text-white text-xl">
                        Loading your universe...
                    </div>
                )}
            </div>

        </main>
    );
}