import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const vertices = await req.json() as {x: number, y: number}[];

    const data = vertices.map(p => `${p.x}, ${p.y}`).join('\n');
    
    try {
        await writeFile('../../vertices.txt', data);
        return NextResponse.json({ status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500})
    }
}