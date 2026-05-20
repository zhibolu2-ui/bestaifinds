import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const exec = promisify(execFile);
const TMP_DIR = "/tmp/baf-convert";

async function ensureTmpDir() {
  if (!existsSync(TMP_DIR)) await mkdir(TMP_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const rl = checkRateLimit(ip, "file-convert", RATE_LIMITS.fileConvert.max, RATE_LIMITS.fileConvert.windowMs);
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

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
    }

    await ensureTmpDir();
    const id = randomUUID();
    const ext = file.name.split(".").pop() || "docx";
    const inputPath = join(TMP_DIR, `${id}.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    let outputPath: string;
    let outputExt: string;

    switch (action) {
      case "word-to-pdf":
      case "excel-to-pdf":
      case "ppt-to-pdf": {
        outputExt = "pdf";
        try {
          await exec("libreoffice", [
            "--headless",
            "--convert-to", "pdf",
            "--outdir", TMP_DIR,
            inputPath,
          ], { timeout: 60000 });
        } catch (e) {
          await cleanup(inputPath);
          console.error("LibreOffice error:", e);
          return NextResponse.json(
            { error: "Document conversion failed. LibreOffice may not be installed." },
            { status: 500 },
          );
        }
        outputPath = join(TMP_DIR, `${id}.pdf`);
        break;
      }
      case "pdf-to-word": {
        outputExt = "txt";
        outputPath = join(TMP_DIR, `${id}.txt`);
        try {
          await exec("pdftotext", ["-layout", inputPath, outputPath], { timeout: 60000 });
        } catch (e) {
          await cleanup(inputPath);
          console.error("pdftotext error:", e);
          return NextResponse.json(
            { error: "PDF text extraction failed. poppler-utils may not be installed." },
            { status: 500 },
          );
        }
        break;
      }
      default: {
        await cleanup(inputPath);
        return NextResponse.json({ error: "Unknown conversion type" }, { status: 400 });
      }
    }

    if (!existsSync(outputPath)) {
      await cleanup(inputPath);
      return NextResponse.json({ error: "Output file not created" }, { status: 500 });
    }

    const outputBuffer = await readFile(outputPath);
    await cleanup(inputPath, outputPath);

    const mimeMap: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
    };

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": mimeMap[outputExt] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="converted.${outputExt}"`,
      },
    });
  } catch (e) {
    console.error("File convert error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function cleanup(...paths: string[]) {
  for (const p of paths) {
    try { await unlink(p); } catch { /* ignore */ }
  }
}
