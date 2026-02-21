import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
    const { vertices } = await req.json();

    return new Promise((resolve) => {
      const script = path.join(process.cwd(), "app", "src", "main.py");
      const python = spawn("python", [script]);
    
      python.stdin.write(
        JSON.stringify({
          vertices,
          tolerance: 0.005
        })
      );
    
      python.stdin.end();
      let res = "";
      let errorOutput = "";
    
      python.stdout.on("data", (data) => {
        res += data.toString();
      });

      python.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });
    
      python.on("close", () => {
        if (errorOutput) {
            resolve(
                NextResponse.json({ error: errorOutput }, { status: 500})
            );
        } else {
            resolve(
                NextResponse.json(JSON.parse(res))
            );
        }
      })
    }) 
}