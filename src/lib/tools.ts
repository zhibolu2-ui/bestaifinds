export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  featured?: boolean;
  processing: "browser" | "api" | "server";
}

export type Category = "pdf" | "image" | "write" | "video" | "file";

export const CATEGORIES: Record<Category, { label: string; description: string; color: string }> = {
  pdf: {
    label: "PDF",
    description: "Edit, merge, convert and manage PDF files online for free",
    color: "text-red-500",
  },
  image: {
    label: "Image",
    description: "Transform, convert and enhance images with powerful tools",
    color: "text-blue-500",
  },
  write: {
    label: "Write",
    description: "AI-powered writing tools for content creation and editing",
    color: "text-emerald-500",
  },
  video: {
    label: "Video",
    description: "Convert, compress and edit videos effortlessly",
    color: "text-purple-500",
  },
  file: {
    label: "File",
    description: "Convert between file formats including CSV, Excel, JSON and XML",
    color: "text-amber-500",
  },
};

export const TOOLS: Tool[] = [
  // ── PDF Tools ──
  { slug: "merge", name: "Merge PDF", description: "Combine multiple PDF files into one", category: "pdf", icon: "📎", featured: true, processing: "browser" },
  { slug: "edit", name: "Edit PDF", description: "Add text, annotations and signatures to PDFs", category: "pdf", icon: "✏️", featured: true, processing: "browser" },
  { slug: "split", name: "Split PDF", description: "Extract pages or split PDFs into smaller files", category: "pdf", icon: "✂️", featured: true, processing: "browser" },
  { slug: "compress", name: "Compress PDF", description: "Reduce PDF file size while keeping quality", category: "pdf", icon: "📦", processing: "browser" },
  { slug: "to-word", name: "PDF to Word", description: "Convert PDF documents to editable Word files", category: "pdf", icon: "📝", featured: true, processing: "server" },
  { slug: "to-jpg", name: "PDF to JPG", description: "Convert each PDF page into a JPG image", category: "pdf", icon: "🖼️", processing: "browser" },
  { slug: "from-images", name: "JPG to PDF", description: "Convert images into a single PDF document", category: "pdf", icon: "📄", processing: "browser" },
  { slug: "word-to-pdf", name: "Word to PDF", description: "Convert Word documents to PDF format", category: "pdf", icon: "📋", processing: "server" },
  { slug: "rotate", name: "Rotate PDF", description: "Rotate PDF pages to any orientation", category: "pdf", icon: "🔄", processing: "browser" },
  { slug: "rearrange", name: "Rearrange PDF", description: "Reorder pages within a PDF", category: "pdf", icon: "🔀", processing: "browser" },
  { slug: "protect", name: "Protect PDF", description: "Add password protection to PDF files", category: "pdf", icon: "🔒", processing: "browser" },
  { slug: "unlock", name: "Unlock PDF", description: "Remove password from protected PDFs", category: "pdf", icon: "🔓", processing: "browser" },
  { slug: "esign", name: "eSign PDF", description: "Electronically sign PDF documents", category: "pdf", icon: "🖊️", processing: "browser" },
  { slug: "watermark", name: "Add Watermark", description: "Add text or image watermarks to PDFs", category: "pdf", icon: "💧", processing: "browser" },
  { slug: "page-numbers", name: "Add Page Numbers", description: "Add page numbers to your PDF", category: "pdf", icon: "🔢", processing: "browser" },
  { slug: "delete-pages", name: "Delete Pages", description: "Remove specific pages from a PDF", category: "pdf", icon: "🗑️", processing: "browser" },
  { slug: "crop", name: "Crop PDF", description: "Crop and trim PDF page margins", category: "pdf", icon: "✂️", processing: "browser" },
  { slug: "to-png", name: "PDF to PNG", description: "Convert PDF pages to PNG images", category: "pdf", icon: "🖼️", processing: "browser" },
  { slug: "translator", name: "PDF Translator", description: "Translate PDF documents to any language with AI", category: "pdf", icon: "🌐", processing: "api" },
  { slug: "summarize", name: "Summarize PDF", description: "Get an AI-powered summary of any PDF", category: "pdf", icon: "📋", processing: "api" },

  // ── Image Tools ──
  { slug: "remove-bg", name: "Remove Background", description: "Remove image backgrounds instantly with AI", category: "image", icon: "🎨", featured: true, processing: "server" },
  { slug: "upscale", name: "Upscale Image", description: "Enhance image resolution with AI", category: "image", icon: "🔍", featured: true, processing: "server" },
  { slug: "compress", name: "Compress Image", description: "Reduce image file size without losing quality", category: "image", icon: "📦", featured: true, processing: "browser" },
  { slug: "resize", name: "Resize Image", description: "Change image dimensions to any size", category: "image", icon: "📐", processing: "browser" },
  { slug: "crop", name: "Crop Image", description: "Crop and trim images to any size", category: "image", icon: "✂️", processing: "browser" },
  { slug: "flip", name: "Flip Image", description: "Flip images horizontally or vertically", category: "image", icon: "↔️", processing: "browser" },
  { slug: "to-text", name: "Image to Text", description: "Extract text from images using OCR", category: "image", icon: "📝", featured: true, processing: "browser" },
  { slug: "ai-image-generator", name: "AI Image Generator", description: "Create images from text descriptions with AI", category: "image", icon: "🤖", featured: true, processing: "api" },
  { slug: "heic-to-jpg", name: "HEIC to JPG", description: "Convert iPhone HEIC photos to JPG format", category: "image", icon: "📱", processing: "browser" },
  { slug: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG images to JPG format", category: "image", icon: "🔄", processing: "browser" },
  { slug: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG images to PNG format", category: "image", icon: "🔄", processing: "browser" },
  { slug: "webp-to-jpg", name: "WEBP to JPG", description: "Convert WEBP images to JPG format", category: "image", icon: "🔄", processing: "browser" },
  { slug: "black-white", name: "Black & White", description: "Convert color photos to black and white", category: "image", icon: "⬛", processing: "browser" },
  { slug: "pixelate", name: "Pixelate Image", description: "Add pixelation effect to images", category: "image", icon: "🟩", processing: "browser" },
  { slug: "add-text", name: "Add Text to Image", description: "Overlay text on any image", category: "image", icon: "🔤", processing: "browser" },
  { slug: "combine", name: "Combine Images", description: "Merge multiple images into one", category: "image", icon: "🧩", processing: "browser" },

  // ── Write / AI Tools ──
  { slug: "content-improver", name: "Content Improver", description: "Enhance and polish your writing with AI", category: "write", icon: "✨", featured: true, processing: "api" },
  { slug: "essay-writer", name: "Essay Writer", description: "Generate well-structured essays on any topic", category: "write", icon: "📝", featured: true, processing: "api" },
  { slug: "paragraph-writer", name: "Paragraph Writer", description: "Create paragraphs on any subject instantly", category: "write", icon: "📄", processing: "api" },
  { slug: "grammar-fixer", name: "Grammar Fixer", description: "Fix grammar, spelling and punctuation errors", category: "write", icon: "✅", featured: true, processing: "api" },
  { slug: "article-writer", name: "Article Writer", description: "Generate full articles from a title or topic", category: "write", icon: "📰", processing: "api" },
  { slug: "sentence-rewriter", name: "Sentence Rewriter", description: "Rephrase sentences while keeping the meaning", category: "write", icon: "🔄", processing: "api" },
  { slug: "content-summarizer", name: "Content Summarizer", description: "Summarize long texts into key points", category: "write", icon: "📋", processing: "api" },
  { slug: "humanizer-ai", name: "AI Humanizer", description: "Make AI-generated text sound more human", category: "write", icon: "🧑", featured: true, processing: "api" },
  { slug: "tone-of-voice", name: "Tone of Voice", description: "Adjust the tone and style of your writing", category: "write", icon: "🎭", processing: "api" },
  { slug: "blog-post", name: "Blog Post Generator", description: "Generate SEO-optimized blog posts with AI", category: "write", icon: "💻", processing: "api" },
  { slug: "youtube-script-writer", name: "YouTube Script Writer", description: "Create engaging scripts for YouTube videos", category: "write", icon: "🎬", processing: "api" },
  { slug: "story-generator", name: "Story Generator", description: "Create creative stories with AI assistance", category: "write", icon: "📖", processing: "api" },
  { slug: "translate", name: "Translate", description: "Translate text between 100+ languages with AI", category: "write", icon: "🌍", processing: "api" },
  { slug: "paragraph-completer", name: "Paragraph Completer", description: "Complete unfinished paragraphs with AI", category: "write", icon: "➡️", processing: "api" },

  // ── Video Tools ──
  { slug: "compress", name: "Compress Video", description: "Reduce video file size while preserving quality", category: "video", icon: "📦", featured: true, processing: "server" },
  { slug: "trim", name: "Trim Video", description: "Cut and trim video clips to exact length", category: "video", icon: "✂️", featured: true, processing: "server" },
  { slug: "to-gif", name: "Video to GIF", description: "Convert video clips to animated GIFs", category: "video", icon: "🎞️", processing: "server" },
  { slug: "mp4-to-mp3", name: "MP4 to MP3", description: "Extract audio from MP4 video files", category: "video", icon: "🎵", featured: true, processing: "server" },
  { slug: "extract-audio", name: "Extract Audio", description: "Extract audio tracks from any video", category: "video", icon: "🔊", processing: "server" },
  { slug: "mute", name: "Mute Video", description: "Remove audio from video files", category: "video", icon: "🔇", processing: "server" },
  { slug: "resize", name: "Resize Video", description: "Change video resolution and dimensions", category: "video", icon: "📐", processing: "server" },
  { slug: "to-text", name: "Video to Text", description: "Transcribe video speech to text with AI", category: "video", icon: "📝", processing: "api" },
  { slug: "youtube-to-text", name: "YouTube to Text", description: "Get text transcripts from YouTube videos", category: "video", icon: "📺", processing: "api" },
  { slug: "mov-to-mp4", name: "MOV to MP4", description: "Convert MOV videos to MP4 format", category: "video", icon: "🔄", processing: "server" },
  { slug: "webm-to-mp4", name: "WEBM to MP4", description: "Convert WEBM videos to MP4 format", category: "video", icon: "🔄", processing: "server" },
  { slug: "avi-to-mp4", name: "AVI to MP4", description: "Convert AVI videos to MP4 format", category: "video", icon: "🔄", processing: "server" },

  // ── File Tools ──
  { slug: "csv-to-json", name: "CSV to JSON", description: "Convert CSV spreadsheets to JSON format", category: "file", icon: "📊", processing: "browser" },
  { slug: "json-to-csv", name: "JSON to CSV", description: "Convert JSON data to CSV spreadsheets", category: "file", icon: "📊", processing: "browser" },
  { slug: "csv-to-excel", name: "CSV to Excel", description: "Convert CSV files to Excel spreadsheets", category: "file", icon: "📈", processing: "browser" },
  { slug: "xml-to-json", name: "XML to JSON", description: "Convert XML data to JSON format", category: "file", icon: "📄", processing: "browser" },
  { slug: "json-to-xml", name: "JSON to XML", description: "Convert JSON data to XML format", category: "file", icon: "📄", processing: "browser" },
  { slug: "excel-to-csv", name: "Excel to CSV", description: "Convert Excel spreadsheets to CSV format", category: "file", icon: "📉", processing: "browser" },
  { slug: "excel-to-pdf", name: "Excel to PDF", description: "Convert Excel spreadsheets to PDF documents", category: "file", icon: "📋", processing: "server" },
  { slug: "xml-to-csv", name: "XML to CSV", description: "Convert XML data to CSV spreadsheets", category: "file", icon: "📊", processing: "browser" },
  { slug: "qr-code", name: "QR Code Generator", description: "Create QR codes for URLs, text and more", category: "file", icon: "📱", processing: "browser" },
  { slug: "base64", name: "Base64 Encoder", description: "Encode and decode Base64 strings", category: "file", icon: "🔐", processing: "browser" },
  { slug: "epoch-converter", name: "Epoch Converter", description: "Convert between Unix timestamps and dates", category: "file", icon: "⏰", processing: "browser" },
  { slug: "word-counter", name: "Word Counter", description: "Count words, characters and sentences in text", category: "file", icon: "🔢", processing: "browser" },
];

export function getToolsByCategory(category: Category): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter((t) => t.featured);
}

export function getToolBySlug(category: Category, slug: string): Tool | undefined {
  return TOOLS.find((t) => t.category === category && t.slug === slug);
}
