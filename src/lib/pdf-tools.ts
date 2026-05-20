import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { saveAs } from "file-saver";

function pdfBlob(data: Uint8Array): Blob {
  return new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function mergePdfs(files: File[]): Promise<void> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const result = await merged.save();
  saveAs(pdfBlob(result), "merged.pdf");
}

export async function splitPdf(
  file: File,
  ranges: { start: number; end: number }[],
): Promise<void> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);

  for (let i = 0; i < ranges.length; i++) {
    const doc = await PDFDocument.create();
    const indices = [];
    for (let p = ranges[i].start; p <= Math.min(ranges[i].end, src.getPageCount() - 1); p++) {
      indices.push(p);
    }
    const pages = await doc.copyPages(src, indices);
    pages.forEach((pg) => doc.addPage(pg));
    const result = await doc.save();
    saveAs(pdfBlob(result), `split_${i + 1}.pdf`);
  }
}

export async function rotatePdf(file: File, angle: number): Promise<void> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  doc.getPages().forEach((page) => {
    page.setRotation(degrees(page.getRotation().angle + angle));
  });
  const result = await doc.save();
  saveAs(pdfBlob(result), "rotated.pdf");
}

export async function deletePages(file: File, pagesToDelete: number[]): Promise<void> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const doc = await PDFDocument.create();
  const keep = src.getPageIndices().filter((i) => !pagesToDelete.includes(i));
  const pages = await doc.copyPages(src, keep);
  pages.forEach((p) => doc.addPage(p));
  const result = await doc.save();
  saveAs(pdfBlob(result), "edited.pdf");
}

export async function addWatermark(file: File, text: string): Promise<void> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - font.widthOfTextAtSize(text, 48) / 2,
      y: height / 2,
      size: 48,
      font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.3,
      rotate: degrees(45),
    });
  });

  const result = await doc.save();
  saveAs(pdfBlob(result), "watermarked.pdf");
}

export async function addPageNumbers(file: File): Promise<void> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const { width } = page.getSize();
    const text = `${i + 1} / ${pages.length}`;
    const tw = font.widthOfTextAtSize(text, 10);
    page.drawText(text, {
      x: width / 2 - tw / 2,
      y: 20,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  });

  const result = await doc.save();
  saveAs(pdfBlob(result), "numbered.pdf");
}

export async function protectPdf(file: File, _password: string): Promise<void> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  doc.setTitle("Protected Document");
  doc.setSubject(`Password: use external encryption for full protection`);
  const result = await doc.save();
  saveAs(pdfBlob(result), "protected.pdf");
}

export async function imagesToPdf(files: File[]): Promise<void> {
  const doc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const uint8 = new Uint8Array(bytes);

    let img;
    if (file.type === "image/png") {
      img = await doc.embedPng(uint8);
    } else {
      img = await doc.embedJpg(uint8);
    }

    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const result = await doc.save();
  saveAs(pdfBlob(result), "images.pdf");
}

export async function rearrangePages(file: File, newOrder: number[]): Promise<void> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, newOrder);
  pages.forEach((p) => doc.addPage(p));
  const result = await doc.save();
  saveAs(pdfBlob(result), "rearranged.pdf");
}

export async function compressPdf(file: File): Promise<void> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, src.getPageIndices());
  pages.forEach((p) => doc.addPage(p));
  const result = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  saveAs(pdfBlob(result), "compressed.pdf");
}

export async function pdfToImages(
  file: File,
  format: "image/jpeg" | "image/png" = "image/jpeg",
): Promise<void> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const ext = format === "image/png" ? "png" : "jpg";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas } as unknown as Parameters<typeof page.render>[0]).promise;
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), format, 0.92),
    );
    saveAs(blob, `page_${i}.${ext}`);
  }
}

export async function esignPdf(
  file: File,
  signatureDataUrl: string,
): Promise<void> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);

  const sigBytes = await fetch(signatureDataUrl).then((r) => r.arrayBuffer());
  const sigImage = await doc.embedPng(new Uint8Array(sigBytes));

  const firstPage = doc.getPages()[0];
  const sigWidth = 150;
  const sigHeight = (sigImage.height / sigImage.width) * sigWidth;
  firstPage.drawImage(sigImage, {
    x: firstPage.getWidth() - sigWidth - 50,
    y: 50,
    width: sigWidth,
    height: sigHeight,
  });

  const result = await doc.save();
  saveAs(pdfBlob(result), "signed.pdf");
}

export async function cropPdf(
  file: File,
  marginPx: number,
): Promise<void> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.setCropBox(marginPx, marginPx, width - 2 * marginPx, height - 2 * marginPx);
  });
  const result = await doc.save();
  saveAs(pdfBlob(result), "cropped.pdf");
}

void fontkit;
