import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

const SYSTEM_PROMPTS: Record<string, string> = {
  "content-improver":
    "You are a professional editor. Improve the user's text: fix grammar, enhance clarity, improve flow, and make it more engaging. Keep the original meaning.",
  "essay-writer":
    "You are an academic essay writer. Write a well-structured essay on the given topic with introduction, body paragraphs, and conclusion.",
  "paragraph-writer":
    "Write a well-crafted paragraph on the given topic. Make it informative and engaging.",
  "grammar-fixer":
    "Fix all grammar, spelling, and punctuation errors in the text. Return only the corrected text.",
  "article-writer":
    "Write a comprehensive article on the given topic. Include a title, introduction, several sections with subheadings, and a conclusion.",
  "sentence-rewriter":
    "Rewrite the sentence in a different way while preserving the original meaning. Provide 3 alternative versions.",
  "content-summarizer":
    "Summarize the following text into key points. Be concise but capture all important information.",
  "humanizer-ai":
    "Rewrite the text to sound more natural and human-written. Vary sentence length, add personal touches, and remove robotic patterns.",
  "tone-of-voice":
    "Rewrite the text with a more professional and polished tone while preserving the content.",
  "blog-post":
    "Write an SEO-optimized blog post on the given topic. Include a catchy title, introduction, 3-5 sections with headings, and a conclusion.",
  "youtube-script-writer":
    "Write an engaging YouTube video script. Include a hook intro, main content sections, transitions, and a call-to-action outro.",
  "story-generator":
    "Write a creative and engaging short story based on the given prompt.",
  "translate":
    "Translate the following text. If the text is in English, translate to Chinese. If it's in Chinese, translate to English. If another language, translate to English.",
  "paragraph-completer":
    "Complete the following unfinished paragraph in a natural and coherent way.",
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const rl = checkRateLimit(ip, "ai-generate", RATE_LIMITS.aiGenerate.max, RATE_LIMITS.aiGenerate.windowMs);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again.", retryAfterMs: rl.resetInMs },
        { status: 429 },
      );
    }

    const { tool, input } = await req.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    if (!OPENAI_KEY) {
      return NextResponse.json(
        { result: "AI service is not configured. Please set the OPENAI_API_KEY environment variable." },
        { status: 200 },
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[tool] || "You are a helpful writing assistant. Help the user with their request.";

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
          { role: "user", content: input },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return NextResponse.json({ result: "AI service temporarily unavailable. Please try again later." });
    }

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || "No result generated.";

    return NextResponse.json({ result });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
