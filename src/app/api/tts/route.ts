import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ttsSchema = z.object({
  voice_id: z.string(),
  text: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ttsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsKey) {
      return NextResponse.json(
        { error: "Cloud TTS not configured. Browser TTS is active." },
        { status: 501 }
      );
    }

    // Optional Tier B Cloud TTS Proxy implementation
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${parsed.data.voice_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": elevenLabsKey,
        },
        body: JSON.stringify({
          text: parsed.data.text,
          model_id: "eleven_turbo_v2_5",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloud TTS error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to generate TTS audio" },
      { status: 500 }
    );
  }
}
