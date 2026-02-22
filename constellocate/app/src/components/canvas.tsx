import Button from "@/app/components/ui/Button";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Point } from "../lib/douglas-peucker";
import Constellation from "./constellation-viewer";
import { House } from 'lucide-react';
import { motion } from "framer-motion";

interface canvasProps {
    onSubmit: (vertices: Point[]) => Promise<{ hips: number[], vertices: Point[], data3D: any[] }>
}

export default function Canvas({ onSubmit }: canvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null)
    const [path, setPath] = useState<Point[]>([]);
    const [paths, setPaths] = useState<Point[][]>([]);
    const [isDrawing, setDrawing] = useState<boolean>(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
    const [brushSize] = useState(3)
    const [isLoading, setLoading] = useState<boolean>(false);
    const [constellation, setConstellation] = useState<{ hips: number[], vertices: Point[]; data3D: any[] }>({ hips: [], vertices: [], data3D: [] });
    const [isConstellation, setIsConstellation] = useState<boolean>(false);


    useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                const dpr = window.devicePixelRatio || 1
                canvas.width = width * dpr
                canvas.height = height * dpr
                setCanvasSize({ width, height })

                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.scale(dpr, dpr)
                }
            }
        })

        resizeObserver.observe(container)
        return () => resizeObserver.disconnect()
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const dpr = window.devicePixelRatio || 1
        ctx.save()
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

        for (const path of paths) {
            drawPath(ctx, path, canvasSize, brushSize)
        }
        if (path.length > 0) {
            drawPath(ctx, path, canvasSize, brushSize)
        }

        ctx.restore()
    }, [paths, path, canvasSize, brushSize]);

    const getCanvasPoint = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            let x: number, y: number;
            if ("touches" in e) {
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }
            return {
                x: (x - rect.left) / rect.width,
                y: (y - rect.top) / rect.height,
            }
        }, []
    );

    const handleMove = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault();
            if (!isDrawing) return;
            const point = getCanvasPoint(e);
            if (!point) return;
            setPath((prev) => [...prev, point]);
        }, [isDrawing, getCanvasPoint]
    );

    const handleStart = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault();
            const point = getCanvasPoint(e);
            if (!point) return;
            setDrawing(true);
            setPath([point]);
        }, [getCanvasPoint]
    );

    const handleEnd = useCallback(() => {
        if (!isDrawing) return;
        setDrawing(false);
        // Add current path to paths list
        if (path.length > 1) {
            setPaths((prev) => [...prev, path])
        }
        // Reset current path
        setPath([]);
    }, [isDrawing, path]);


    return (
        <div>
            {!isLoading && !isConstellation ? (
                <div ref={containerRef} className="relative cursor-crosshair overflow-hidden h-screen">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full z-10"
                        onMouseDown={handleStart}
                        onMouseMove={handleMove}
                        onMouseUp={handleEnd}
                        onMouseLeave={handleEnd}
                        onTouchStart={handleStart}
                        onTouchMove={handleMove}
                        onTouchEnd={handleEnd}
                        style={{ touchAction: "none" }}
                    >
                </canvas>
                <div className="flex min-h-screen flex-col">
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="absolute top-8 right-8 flex items-center gap-4 z-20">
                            <Button text={'Credits'} onClick={() => (window.location.href = '/credits')} size="sm"/>
                            <Button icon={House} size="sm" onClick={()=> (window.location.href = '/')}/>     
                </motion.div>
                    {/* <div className = "mt-auto pb-2 relative z-10 grid grid-cols-3 gap-5 mx-auto "> */}
                    <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 100 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20"
      >
                        <Button text={'Submit'} onClick={async () => {
                            setLoading(true);
                            const stars = await onSubmit(paths.flat());
                            setConstellation(stars);
                            setIsConstellation(true);
                            setLoading(false);
                        }} />
                        
                        <Button text="Undo"
                        onClick={() => {
                            setPaths(prev => prev.slice(0, -1));
                        }}
                        />
                        <Button text="Clear"
                            onClick={() => {
                            const canvas = canvasRef.current;
                            if (!canvas) return;

                                    const ctx = canvas.getContext("2d");
                                    if (!ctx) return;

                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            setPath([]);
                            setPaths([]);
                        }}
                        />
                        

                    </motion.div>
                </div>
                  
            </div>
            
            
            ) : ( isLoading && !isConstellation ? (
                <main className="flex flex-col items-center justify-center gap-50 relative x-100 z-50">
                    {/* UIverse Loader */}
                    {/* <div className="container">
                <div className="moon">
                    <div className="crater crater1"></div>
                    <div className="crater crater2"></div>
                    <div className="crater crater3"></div>
                    <div className="crater crater4"></div>
                    <div className="crater crater5"></div>
                    <div className="shadow"></div>
                    <div className="eye eye-l"></div>
                    <div className="eye eye-r"></div>
                    <div className="mouth"></div>
                    <div className="blush blush1"></div>
                    <div className="blush blush2"></div>
                </div>

                <div className="orbit">
                    <div className="rocket">
                    <div className="window"></div>
                    <div className="fire"></div>
                    <div className="gas"></div>
                    <div className="gas"></div>
                    <div className="gas"></div>
                    <div className="gas"></div>
                    <div className="gas"></div>
                    <div className="gas"></div>
                    <div className="gas"></div>
                    </div>
                </div>

                <div className="curve">
                    <svg viewBox="0 0 500 500">
                    <path
                        id="loading"
                        d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
                    ></path>
                    <text width="500">
                        <textPath xlinkHref="#loading">...loading...</textPath>
                    </text>
                    </svg>
                </div>
                </div> */}
                    {/* <!-- From Uiverse.io by narmesh_sah -->  */}
                    {/* <div className="preloader">
                <div className="crack crack1"></div>
                <div className="crack crack2"></div>
                <div className="crack crack3"></div>
                <div className="crack crack4"></div>
                <div className="crack crack5"></div>
                </div> */}

                    {/* <!-- From Uiverse.io by LightAndy1 -->  */}
                    <div className="loader mt-20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            className="star star1"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                            ></path>
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            className="star star2"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                            ></path>
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            className="star star3"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                            ></path>
                        </svg>
                    </div>




                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Loading your constellation...
                    </h1>
                </main>
            ) : (
                <Constellation stars={constellation} />
            )
            )}
        </div>
    )
}


function drawPath(
    ctx: CanvasRenderingContext2D,
    path: { x: number; y: number }[],
    size: { width: number; height: number },
    brushSize: number
) {
    if (path.length < 2) return

    ctx.beginPath()
    ctx.moveTo(path[0].x * size.width, path[0].y * size.height)

    // Smooth curve through points
    for (let i = 1; i < path.length - 1; i++) {
        const xc = (path[i].x * size.width + path[i + 1].x * size.width) / 2
        const yc = (path[i].y * size.height + path[i + 1].y * size.height) / 2
        ctx.quadraticCurveTo(path[i].x * size.width, path[i].y * size.height, xc, yc)
    }
    const last = path[path.length - 1]
    ctx.lineTo(last.x * size.width, last.y * size.height)

    // Main stroke
    ctx.strokeStyle = "rgba(160, 200, 255, 0.85)"
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // Outer glow
    ctx.strokeStyle = "rgba(130, 180, 255, 0.12)"
    ctx.lineWidth = brushSize + 10
    ctx.stroke()

    // Inner bright core
    ctx.strokeStyle = "rgba(220, 240, 255, 0.4)"
    ctx.lineWidth = brushSize * 0.5
    ctx.stroke()

    // Draw dots at endpoints
    const first = path[0]
    for (const p of [first, last]) {
        ctx.beginPath()
        ctx.arc(p.x * size.width, p.y * size.height, brushSize + 1, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(180, 210, 255, 0.5)"
        ctx.fill()
    }
}
