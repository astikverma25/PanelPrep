import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildReportPrompt } from "@/lib/ai/prompts";
import { calculateDeterministicStats } from "@/lib/ai/statsCalculator";
import { validateAndCleanReportEvidence } from "@/lib/ai/evidenceValidator";
import { GDReport } from "@/lib/types/report";

const segmentSchema = z.object({
  id: z.string(),
  speakerId: z.string(),
  speakerName: z.string(),
  isUser: z.boolean(),
  startMs: z.number(),
  endMs: z.number(),
  text: z.string(),
  interrupted: z.boolean(),
});

const reportRequestSchema = z.object({
  topic: z.string().min(1),
  duration_s: z.number(),
  segments: z.array(segmentSchema),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { topic, duration_s, segments } = parsed.data;

    // 1. Calculate Instant Deterministic Stats
    const stats = calculateDeterministicStats(segments, duration_s);

    // 2. Format transcript with explicit segment IDs for quote verification
    const formattedWithIds = segments
      .map((s) => `[${s.id}] ${s.speakerName}: "${s.text}"`)
      .join("\n");

    const prompt = buildReportPrompt(topic, duration_s, formattedWithIds);

    let rawReportJson: any = null;
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (geminiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${
          process.env.REPORT_LLM_MODEL || "gemini-1.5-flash"
        }:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        try {
          rawReportJson = JSON.parse(text);
        } catch {}
      }
    } else if (groqKey) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        try {
          rawReportJson = JSON.parse(text);
        } catch {}
      }
    }

    // Default fallback structured dimensions if AI key absent
    const fallbackDimensions = [
      {
        name: "starting_the_discussion" as const,
        displayName: "Starting the Discussion & Framing",
        score: stats.studentTurnsCount > 0 ? 3 : 1,
        summary: "Participated in the discussion and provided key perspectives.",
        strengths: ["Clear participation."],
        improvements: ["Aim to initiate definitions even earlier."],
        evidence: [],
      },
      {
        name: "quality_of_ideas" as const,
        displayName: "Depth & Quality of Ideas",
        score: stats.studentTurnsCount > 0 ? 3 : 1,
        summary: "Expressed logical reasoning on the core prompt.",
        strengths: ["Logical structure."],
        improvements: ["Incorporate more industry metrics."],
        evidence: [],
      },
      {
        name: "building_on_others" as const,
        displayName: "Collaboration & Synthesis",
        score: stats.referencesToOthersCount > 0 ? 4 : 3,
        summary: "Acknowledged peer remarks during discussion turns.",
        strengths: ["Collaborative tone."],
        improvements: ["Explicitly synthesize conflicting viewpoints."],
        evidence: [],
      },
      {
        name: "listening" as const,
        displayName: "Active Listening & Relevance",
        score: 4,
        summary: "Remained attentive to the flow of conversation.",
        strengths: ["Relevant timing."],
        improvements: ["Directly address counter-arguments raised."],
        evidence: [],
      },
      {
        name: "handling_interruptions" as const,
        displayName: "Composure & Turn Management",
        score: stats.studentInterruptionsCount > 2 ? 3 : 4,
        summary: "Managed conversational floor transitions well.",
        strengths: ["Maintained calm presence."],
        improvements: ["Yield or hold floor deliberately when interrupted."],
        evidence: [],
      },
      {
        name: "ending_strongly" as const,
        displayName: "Concluding & Summarizing",
        score: 3,
        summary: "Delivered final thoughts during the closing stage.",
        strengths: ["Concise delivery."],
        improvements: ["Summarize unanimous agreements explicitly."],
        evidence: [],
      },
    ];

    const unverifiedDimensions = rawReportJson?.dimensions || fallbackDimensions;
    // 3. Scrub and Validate Evidence Quotes against Actual Transcript
    const verifiedDimensions = validateAndCleanReportEvidence(
      unverifiedDimensions,
      segments
    );

    const reportResponse: GDReport = {
      sessionId: `gd_${Date.now()}`,
      createdAt: new Date().toISOString(),
      topic,
      durationSeconds: duration_s,
      stats,
      dimensions: verifiedDimensions,
      missed_openings: rawReportJson?.missed_openings || [],
      top_3_actions: rawReportJson?.top_3_actions || [
        "Take initiative to define the structural framework in the first 30 seconds.",
        "Acknowledge other participants by name when building or countering points.",
        "Synthesize conflicting viewpoints during the final closing round.",
      ],
      transcript: segments,
    };

    return NextResponse.json(reportResponse);
  } catch (error) {
    console.error("Report route error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
