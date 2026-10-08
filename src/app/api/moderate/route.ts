import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const moderateSchema = z.object({
  topic: z.string().min(3).max(300),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = moderateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { allowed: false, reason: "Topic must be between 3 and 300 characters" },
        { status: 400 }
      );
    }

    const { topic } = parsed.data;

    // Safety checks against explicitly harmful content
    const harmfulKeywords = [
      "bomb",
      "suicide",
      "terrorist",
      "kill all",
      "hate speech",
      "nazi",
    ];
    const isHarmful = harmfulKeywords.some((kw) =>
      topic.toLowerCase().includes(kw)
    );

    if (isHarmful) {
      return NextResponse.json({
        allowed: false,
        reason:
          "This topic cannot be used as it violates safety guidelines. Please choose a constructive GD topic.",
      });
    }

    return NextResponse.json({
      allowed: true,
    });
  } catch (error) {
    return NextResponse.json(
      { allowed: true }, // Fail open for sensible GD topics
      { status: 200 }
    );
  }
}
