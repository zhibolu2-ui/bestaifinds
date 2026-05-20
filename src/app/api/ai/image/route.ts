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

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

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
        n: 1,
        size: "1024x1024",
        quality: "medium",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Image gen error:", err);
      return NextResponse.json({ error: "Image generation failed. Please try again." }, { status: 500 });
    }

    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;
    const url = data.data?.[0]?.url;

    if (b64) {
      return NextResponse.json({ b64, revised_prompt: data.data?.[0]?.revised_prompt });
    }
    if (url) {
      return NextResponse.json({ url, revised_prompt: data.data?.[0]?.revised_prompt });
    }

    return NextResponse.json({ error: "No image generated" }, { status: 500 });
  } catch (e) {
    console.error("Image API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
