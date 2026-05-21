import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const { title, style = "professional", length = "medium" } = await req.json();

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return NextResponse.json({ error: "Please provide a valid title (at least 3 characters)" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  const lengthGuide: Record<string, string> = {
    short: "around 400-600 words",
    medium: "around 800-1200 words",
    long: "around 1500-2000 words",
  };

  const styleGuide: Record<string, string> = {
    professional: "professional and authoritative tone",
    casual: "casual and conversational tone",
    academic: "academic and well-researched tone",
    creative: "creative and engaging storytelling tone",
    seo: "SEO-optimized with keywords naturally integrated",
  };

  const prompt = `Write a comprehensive article with the following requirements:
- Title: "${title.trim()}"
- Style: ${styleGuide[style] || styleGuide.professional}
- Length: ${lengthGuide[length] || lengthGuide.medium}
- Include an engaging introduction
- Use clear headings and subheadings (formatted with markdown ##)
- Include practical examples or insights where relevant
- End with a compelling conclusion
- Make the content original and valuable to readers

Output the article in markdown format.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert content writer who creates high-quality, SEO-optimized articles." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || "AI generation failed" }, { status: 500 });
    }

    const article = data.choices?.[0]?.message?.content;
    if (!article) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    return NextResponse.json({ article, title: title.trim() });
  } catch {
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 });
  }
}
