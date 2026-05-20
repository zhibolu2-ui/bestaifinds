import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const rl = checkRateLimit(ip, "pdf-process", RATE_LIMITS.pdfProcess.max, RATE_LIMITS.pdfProcess.windowMs);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again.", retryAfterMs: rl.resetInMs },
        { status: 429 },
      );
    }

    const { action, text, targetLang } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!OPENAI_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    let systemPrompt: string;
    if (action === "translate") {
      systemPrompt = `Translate the following text to ${targetLang || "English"}. Preserve formatting.`;
    } else if (action === "summarize") {
      systemPrompt = "Summarize the following document into clear, organized key points. Use bullet points and section headers.";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const truncated = text.slice(0, 15000);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: truncated },
        ],
        max_tokens: 3000,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({
      result: data.choices?.[0]?.message?.content || "No result.",
    });
  } catch (e) {
    console.error("PDF process error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
