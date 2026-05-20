import { saveAs } from "file-saver";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      type,
      quality,
    );
  });
}

export async function resizeImage(file: File, width: number, height: number): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, file.type || "image/png");
  saveAs(blob, `resized_${file.name}`);
}

export async function compressImage(file: File, quality: number): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const blob = await canvasToBlob(canvas, "image/jpeg", quality);
  saveAs(blob, `compressed_${file.name.replace(/\.\w+$/, ".jpg")}`);
}

export async function cropImage(
  file: File,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  const blob = await canvasToBlob(canvas, file.type || "image/png");
  saveAs(blob, `cropped_${file.name}`);
}

export async function flipImage(file: File, horizontal: boolean): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  if (horizontal) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }
  ctx.drawImage(img, 0, 0);
  const blob = await canvasToBlob(canvas, file.type || "image/png");
  saveAs(blob, `flipped_${file.name}`);
}

export async function convertFormat(
  file: File,
  targetFormat: "image/jpeg" | "image/png" | "image/webp",
): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;

  if (targetFormat === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  const ext = targetFormat.split("/")[1];
  const blob = await canvasToBlob(canvas, targetFormat, 0.92);
  saveAs(blob, `${file.name.replace(/\.\w+$/, "")}.${ext}`);
}

export async function toBlackWhite(file: File): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);
  const blob = await canvasToBlob(canvas, file.type || "image/png");
  saveAs(blob, `bw_${file.name}`);
}

export async function pixelateImage(file: File, pixelSize: number): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const small = document.createElement("canvas");
  small.width = Math.ceil(w / pixelSize);
  small.height = Math.ceil(h / pixelSize);
  const sCtx = small.getContext("2d")!;
  sCtx.drawImage(img, 0, 0, small.width, small.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, w, h);

  const blob = await canvasToBlob(canvas, file.type || "image/png");
  saveAs(blob, `pixelated_${file.name}`);
}

export async function addTextToImage(file: File, text: string, x: number, y: number, fontSize: number, color: string): Promise<void> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  const blob = await canvasToBlob(canvas, file.type || "image/png");
  saveAs(blob, `text_${file.name}`);
}

export async function combineImages(files: File[], direction: "horizontal" | "vertical"): Promise<void> {
  const images = await Promise.all(files.map(loadImage));

  const canvas = document.createElement("canvas");
  if (direction === "horizontal") {
    canvas.width = images.reduce((sum, img) => sum + img.naturalWidth, 0);
    canvas.height = Math.max(...images.map((img) => img.naturalHeight));
  } else {
    canvas.width = Math.max(...images.map((img) => img.naturalWidth));
    canvas.height = images.reduce((sum, img) => sum + img.naturalHeight, 0);
  }

  const ctx = canvas.getContext("2d")!;
  let offset = 0;
  for (const img of images) {
    if (direction === "horizontal") {
      ctx.drawImage(img, offset, 0);
      offset += img.naturalWidth;
    } else {
      ctx.drawImage(img, 0, offset);
      offset += img.naturalHeight;
    }
  }

  const blob = await canvasToBlob(canvas, "image/png");
  saveAs(blob, "combined.png");
}
