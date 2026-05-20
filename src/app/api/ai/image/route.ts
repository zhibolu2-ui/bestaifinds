import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const rl = checkRateLimit(ip, "ai-image", RATE_LIMITS.aiImage.max, RATE_LIMITS.aiImage.windowMs);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again.", retryAfterMs: rl.resetInMs },
        { status: 429 },
      );
    }

    const { prompt, count } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const n = Math.min(Math.max(1, Number(count) || 1), 4);

    if (!OPENAI_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured. Set OPENAI_API_KEY." },
        { status: 500 },
      );
    }

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n,
        size: "1024x1024",
        quality: "medium",
        moderation: "low",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Image gen error:", errText);
      try {
        const errData = JSON.parse(errText);
        if (errData.error?.code === "moderation_blocked") {
          return NextResponse.json(
            { error: "Your prompt was flagged by content safety. Please try a different description." },
            { status: 400 },
          );
        }
      } catch { /* ignore parse error */ }
      return NextResponse.json({ error: "Image generation failed. Please try again." }, { status: 500 });
    }

    const data = await res.json();
    const images = (data.data || []).map((item: { b64_json?: string; url?: string; revised_prompt?: string }) => ({
      b64: item.b64_json || undefined,
      url: item.url || undefined,
      revised_prompt: item.revised_prompt || undefined,
    }));

    if (images.length === 0) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }

    if (images.length === 1) {
      return NextResponse.json({ b64: images[0].b64, url: images[0].url, revised_prompt: images[0].revised_prompt });
    }

    return NextResponse.json({ images });
  } catch (e) {
    console.error("Image API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
