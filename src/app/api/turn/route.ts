import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PERSONAS } from "@/lib/constants/personas";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { callStreamingLLMWithFallback } from "@/lib/ai/llmClient";

const turnSchema = z.object({
  topic: z.string().min(1),
  phase: z.enum(["prep", "opening", "discussion", "closing", "ended"]),
  persona_id: z.string(),
  intent: z.enum([
    "agree_and_extend",
    "challenge",
    "ask_question",
    "bring_example",
    "redirect",
    "summarise",
    "drift",
    "invite_student",
    "opening",
    "time_check",
    "closing",
  ]),
  time_remaining_s: z.number(),
  turns: z.array(z.object({ speaker: z.string(), text: z.string() })),
  own_recent: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = turnSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      topic,
      phase,
      persona_id,
      intent,
      time_remaining_s,
      turns,
      own_recent,
    } = parsed.data;

    const persona = PERSONAS[persona_id] || PERSONAS.arjun;
    const fallbackCannedLine =
      persona.cannedLines[Math.floor(Math.random() * persona.cannedLines.length)] ||
      "Let's stay focused on the key points.";

    const systemPrompt = buildSystemPrompt(
      persona,
      topic,
      intent,
      time_remaining_s,
      phase,
      own_recent
    );

    const formattedTranscript = turns
      .slice(-10)
      .map((t) => `${t.speaker}: ${t.text}`)
      .join("\n");

    const userPrompt = `<transcript>\n${formattedTranscript}\n</transcript>\n\nSpeak now as ${persona.name}.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        await callStreamingLLMWithFallback(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          {
            onSentence: (sentence) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ sentence })}\n\n`)
              );
            },
            onDone: (fullText) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true, fullText })}\n\n`)
              );
              controller.close();
            },
            onError: (err) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
              );
              controller.close();
            },
          },
          fallbackCannedLine
        );
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Turn route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
