import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { randomUUID } from "crypto";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const exec = promisify(execFile);
const TMP_DIR = "/tmp/baf-video";

async function ensureTmpDir() {
  if (!existsSync(TMP_DIR)) await mkdir(TMP_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const rl = checkRateLimit(ip, "video-process", RATE_LIMITS.videoProcess.max, RATE_LIMITS.videoProcess.windowMs);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again.", retryAfterMs: rl.resetInMs },
        { status: 429 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const action = formData.get("action") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 500MB)" }, { status: 400 });
    }

    await ensureTmpDir();
    const id = randomUUID();
    const ext = file.name.split(".").pop() || "mp4";
    const inputPath = join(TMP_DIR, `${id}_input.${ext}`);
    const outputExt = getOutputExt(action, ext);
    const outputPath = join(TMP_DIR, `${id}_output.${outputExt}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    const args = buildFfmpegArgs(action, inputPath, outputPath);

    try {
      await exec("ffmpeg", args, { timeout: 120000 });
    } catch (e) {
      await cleanup(inputPath, outputPath);
      console.error("FFmpeg error:", e);
      return NextResponse.json(
        { error: "Video processing failed. FFmpeg may not be installed on this server." },
        { status: 500 },
      );
    }

    if (!existsSync(outputPath)) {
      await cleanup(inputPath, outputPath);
      return NextResponse.json({ error: "Output file not created" }, { status: 500 });
    }

    const outputBuffer = await readFile(outputPath);
    await cleanup(inputPath, outputPath);

    const mimeType = getMimeType(outputExt);
    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="processed.${outputExt}"`,
      },
    });
  } catch (e) {
    console.error("Video API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildFfmpegArgs(action: string, input: string, output: string): string[] {
  const base = ["-y", "-i", input];

  switch (action) {
    case "compress":
      return [...base, "-vcodec", "libx264", "-crf", "28", "-preset", "fast", output];
    case "trim":
      return [...base, "-t", "30", "-c", "copy", output];
    case "to-gif":
      return [...base, "-vf", "fps=10,scale=480:-1:flags=lanczos", "-t", "10", output];
    case "mp4-to-mp3":
    case "extract-audio":
      return [...base, "-vn", "-acodec", "libmp3lame", "-q:a", "2", output];
    case "mute":
      return [...base, "-an", "-c:v", "copy", output];
    case "resize":
      return [...base, "-vf", "scale=1280:720", "-c:a", "copy", output];
    case "mov-to-mp4":
    case "webm-to-mp4":
    case "avi-to-mp4":
      return [...base, "-c:v", "libx264", "-c:a", "aac", "-movflags", "+faststart", output];
    default:
      return [...base, "-c", "copy", output];
  }
}

function getOutputExt(action: string, inputExt: string): string {
  const map: Record<string, string> = {
    "compress": "mp4",
    "trim": inputExt,
    "to-gif": "gif",
    "mp4-to-mp3": "mp3",
    "extract-audio": "mp3",
    "mute": "mp4",
    "resize": "mp4",
    "mov-to-mp4": "mp4",
    "webm-to-mp4": "mp4",
    "avi-to-mp4": "mp4",
  };
  return map[action] || "mp4";
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    gif: "image/gif",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
  };
  return map[ext] || "application/octet-stream";
}

async function cleanup(...paths: string[]) {
  for (const p of paths) {
    try { await unlink(p); } catch { /* ignore */ }
  }
}
