// Unified Multi-Provider LLM Client with Fallback & 4s Timeout Racing

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamCallbacks {
  onSentence: (sentence: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: any) => void;
}

export async function callStreamingLLMWithFallback(
  messages: LLMMessage[],
  callbacks: StreamCallbacks,
  fallbackCannedLine: string
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 4000); // 4-second timeout trigger

  let accumulated = "";
  let sentenceBuffer = "";

  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  try {
    let response: Response;

    // Primary Provider: Groq
    if (groqApiKey) {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages,
          max_tokens: 100,
          temperature: 0.7,
          stream: true,
        }),
        signal: controller.signal,
      });
    } else if (geminiApiKey) {
      // Fallback Primary: Gemini
      const prompt = messages.map((m) => `${m.role}: ${m.content}`).join("\n\n");
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${
          process.env.GEMINI_MODEL || "gemini-1.5-flash"
        }:streamGenerateContent?alt=sse&key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 100, temperature: 0.7 },
          }),
          signal: controller.signal,
        }
      );
    } else {
      // No keys provided: use safe fallback line immediately
      callbacks.onSentence(fallbackCannedLine);
      callbacks.onDone(fallbackCannedLine);
      return;
    }

    clearTimeout(timeoutId);

    if (!response.ok || !response.body) {
      throw new Error(`LLM provider status error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ") && line.trim() !== "data: [DONE]") {
          try {
            const data = JSON.parse(line.slice(6));
            const token =
              data.choices?.[0]?.delta?.content ||
              data.candidates?.[0]?.content?.parts?.[0]?.text ||
              "";

            if (token) {
              accumulated += token;
              sentenceBuffer += token;

              // Split at sentence boundaries (period, question mark, exclamation mark followed by space or end)
              const match = sentenceBuffer.match(/([.!?])\s+/);
              if (match && match.index !== undefined) {
                const completeSentence = sentenceBuffer.slice(
                  0,
                  match.index + 1
                );
                sentenceBuffer = sentenceBuffer.slice(match.index + 1).trimStart();
                callbacks.onSentence(completeSentence.trim());
              }
            }
          } catch {}
        }
      }
    }

    if (sentenceBuffer.trim()) {
      callbacks.onSentence(sentenceBuffer.trim());
    }

    callbacks.onDone(accumulated.trim() || fallbackCannedLine);
  } catch (err) {
    console.warn("Primary LLM call failed or timed out. Using fallback line:", err);
    // Graceful recovery: deliver fallback line so room never freezes
    callbacks.onSentence(fallbackCannedLine);
    callbacks.onDone(fallbackCannedLine);
  }
}
