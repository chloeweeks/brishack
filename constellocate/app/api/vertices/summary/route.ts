import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const ai = new GoogleGenAI({});

    const prompt =
      "You are writing a creative and magical summary for a user-drawn constellation. " +
      "Return exactly 2 short sentences. Family-friendly. No quotation marks.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return NextResponse.json({ summary: response.text });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}