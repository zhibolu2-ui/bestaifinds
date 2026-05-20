export interface ToolGuide {
  steps: { title: string; description: string }[];
  faqs: { q: string; a: string }[];
  seoText: string;
}

const PDF_GUIDES: Record<string, ToolGuide> = {
  merge: {
    steps: [
      { title: "Upload PDF Files", description: "Select 2 or more PDF documents to upload from your PC or smartphone." },
      { title: "Arrange File Order", description: "Drag and drop to reorder the files in the order you want them merged." },
      { title: "Download Merged PDF", description: "Click 'Merge PDF' and download your combined PDF file instantly." },
    ],
    faqs: [
      { q: "Is it safe to merge PDFs online?", a: "Yes! Our tool processes files directly in your browser. Your files never leave your device and are never uploaded to any server." },
      { q: "How many PDFs can I merge at once?", a: "You can merge as many PDF files as you need. There's no limit on the number of files." },
      { q: "Will merging PDFs reduce quality?", a: "No. Merging PDFs preserves the original quality of all documents." },
    ],
    seoText: "Merge PDF is one of the most commonly needed PDF tools. Whether you're combining invoices, reports, or study materials, our free online PDF merger makes it easy to join multiple PDF files into a single document without any software installation.",
  },
  split: {
    steps: [
      { title: "Upload Your PDF", description: "Select the PDF file you want to split into smaller files." },
      { title: "Choose Split Options", description: "Specify which pages to extract or how to split the document." },
      { title: "Download Split Files", description: "Click 'Split PDF' and download the resulting files." },
    ],
    faqs: [
      { q: "Can I extract specific pages from a PDF?", a: "Yes! You can extract individual pages or page ranges from any PDF document." },
      { q: "Is split PDF free?", a: "Yes, completely free with no limitations. No sign-up required." },
    ],
    seoText: "Split PDF lets you break large PDF documents into smaller, more manageable files. Extract specific pages or divide a document into equal parts — all processed securely in your browser.",
  },
  compress: {
    steps: [
      { title: "Upload PDF", description: "Select the PDF file you want to compress and reduce in size." },
      { title: "Automatic Compression", description: "Our tool optimizes the PDF using efficient encoding to reduce file size." },
      { title: "Download Compressed PDF", description: "Download your smaller PDF file, perfect for emailing or uploading." },
    ],
    faqs: [
      { q: "How much can PDF compression reduce file size?", a: "Typically 30-70% reduction depending on the PDF content. Image-heavy PDFs see the most improvement." },
      { q: "Will compression affect PDF quality?", a: "Our compression uses lossless techniques that maintain document readability while reducing file size." },
    ],
    seoText: "Compress PDF files online for free. Reduce PDF file size for easier sharing via email, messaging apps, or cloud storage. Our browser-based compression tool keeps your documents looking great while making them significantly smaller.",
  },
};

const IMAGE_GUIDES: Record<string, ToolGuide> = {
  compress: {
    steps: [
      { title: "Upload Image", description: "Select the image you want to compress (JPEG, PNG, or WebP)." },
      { title: "Adjust Quality", description: "Use the quality slider to balance between file size and image quality." },
      { title: "Download Compressed Image", description: "Click the button to compress and download your optimized image." },
    ],
    faqs: [
      { q: "What image formats can I compress?", a: "Our tool supports JPEG, PNG, and WebP formats. The output is always optimized JPEG for maximum compression." },
      { q: "What quality setting should I use?", a: "For web images, 70-80% quality offers the best balance. For print, use 85-95%." },
    ],
    seoText: "Compress images online without losing visible quality. Reduce file sizes for faster website loading, easier sharing, and lower storage usage. All processing happens in your browser for maximum privacy.",
  },
  resize: {
    steps: [
      { title: "Upload Image", description: "Select the image you want to resize." },
      { title: "Set Dimensions", description: "Enter the desired width and height in pixels." },
      { title: "Download Resized Image", description: "Click 'Resize Image' to download the resized version." },
    ],
    faqs: [
      { q: "Will resizing reduce image quality?", a: "Enlarging images may reduce quality. Reducing size maintains quality while making the file smaller." },
      { q: "Can I maintain aspect ratio?", a: "Currently you set both width and height. We recommend calculating proportional dimensions to maintain aspect ratio." },
    ],
    seoText: "Resize images to any dimension instantly. Perfect for social media posts, website thumbnails, profile pictures, and more. No software installation needed.",
  },
};

const WRITE_GUIDES: Record<string, ToolGuide> = {
  "content-improver": {
    steps: [
      { title: "Paste Your Text", description: "Enter or paste the text you want to improve in the input box." },
      { title: "AI Enhancement", description: "Our AI analyzes your text and enhances clarity, flow, and engagement." },
      { title: "Copy Improved Text", description: "Review the improved version and copy it with one click." },
    ],
    faqs: [
      { q: "How does the AI improve my content?", a: "The AI fixes grammar, improves sentence structure, enhances vocabulary, and makes your writing more engaging while preserving the original meaning." },
      { q: "Is there a word limit?", a: "Free users can process up to 2000 words per request." },
    ],
    seoText: "Enhance your writing with AI-powered content improvement. Fix grammar, improve clarity, and make your text more engaging — all in seconds. Perfect for blog posts, emails, essays, and professional documents.",
  },
  "essay-writer": {
    steps: [
      { title: "Enter Your Topic", description: "Type in the essay topic or prompt you need written about." },
      { title: "AI Generation", description: "Our AI creates a well-structured essay with introduction, body, and conclusion." },
      { title: "Copy & Edit", description: "Copy the generated essay and customize it to your needs." },
    ],
    faqs: [
      { q: "Can I specify the essay length?", a: "Include length requirements in your prompt, e.g., 'Write a 500-word essay about...' for best results." },
      { q: "What types of essays can it write?", a: "Argumentative, expository, narrative, descriptive, compare/contrast, and more." },
    ],
    seoText: "Generate well-structured essays on any topic with AI. Our essay writer creates introduction, body paragraphs, and conclusion — saving you hours of writing time. Ideal for students, researchers, and content creators.",
  },
};

const VIDEO_GUIDES: Record<string, ToolGuide> = {
  compress: {
    steps: [
      { title: "Upload Video", description: "Select the video file you want to compress (max 50MB)." },
      { title: "Automatic Processing", description: "Our server compresses the video using H.264 encoding for optimal size reduction." },
      { title: "Download Compressed Video", description: "Download your smaller video file, ready for sharing." },
    ],
    faqs: [
      { q: "How much will my video be compressed?", a: "Typically 50-70% reduction while maintaining good visual quality." },
      { q: "What formats are supported?", a: "MP4, MOV, AVI, WEBM, and most common video formats." },
    ],
    seoText: "Compress video files online for free. Reduce video size for easier sharing via email, messaging, and social media while maintaining quality. Supports all popular video formats.",
  },
  "mp4-to-mp3": {
    steps: [
      { title: "Upload MP4 Video", description: "Select the MP4 video file from which you want to extract audio." },
      { title: "Audio Extraction", description: "Our tool extracts the audio track and converts it to high-quality MP3." },
      { title: "Download MP3", description: "Download the extracted audio file in MP3 format." },
    ],
    faqs: [
      { q: "Will the audio quality be preserved?", a: "Yes, we extract audio at high quality (VBR ~190kbps) which is indistinguishable from the original." },
      { q: "Can I extract audio from other formats?", a: "Yes! Use our 'Extract Audio' tool for any video format including MOV, AVI, and WEBM." },
    ],
    seoText: "Extract audio from MP4 videos and save as MP3. Perfect for converting music videos, lectures, podcasts, and any video content to audio-only files.",
  },
};

const FILE_GUIDES: Record<string, ToolGuide> = {
  "csv-to-json": {
    steps: [
      { title: "Upload CSV File", description: "Select the CSV spreadsheet file you want to convert." },
      { title: "Automatic Conversion", description: "Column headers become JSON keys, each row becomes a JSON object." },
      { title: "Download JSON", description: "Download the converted JSON file instantly." },
    ],
    faqs: [
      { q: "Does it preserve all data types?", a: "All values are converted as strings. You may need to parse numbers manually in your application." },
      { q: "Can it handle large CSV files?", a: "Yes, processing happens entirely in your browser with no upload limits." },
    ],
    seoText: "Convert CSV spreadsheets to JSON format instantly. Perfect for importing data into web applications, APIs, and databases. All conversion happens in your browser for complete privacy.",
  },
  "qr-code": {
    steps: [
      { title: "Enter Content", description: "Type or paste the URL, text, or data you want to encode in the QR code." },
      { title: "Customize", description: "Optionally adjust the size, colors, and error correction level." },
      { title: "Download QR Code", description: "Click 'Generate' and download your QR code as a PNG image." },
    ],
    faqs: [
      { q: "What can I encode in a QR code?", a: "URLs, plain text, Wi-Fi credentials, contact info (vCard), email addresses, phone numbers, and more." },
      { q: "Can I customize the QR code colors?", a: "Yes! You can set both the foreground (data) color and background color." },
    ],
    seoText: "Generate QR codes for free. Create scannable QR codes for websites, Wi-Fi networks, contact cards, and more. Customize size and colors, then download as PNG.",
  },
};

function getDefaultGuide(toolName: string, toolDescription: string): ToolGuide {
  return {
    steps: [
      { title: "Upload Your File", description: `Select the file you want to process with ${toolName}.` },
      { title: "Configure Options", description: "Adjust any available settings to customize the output." },
      { title: "Download Result", description: "Click the process button and download your converted file." },
    ],
    faqs: [
      { q: `Is ${toolName} free to use?`, a: `Yes! ${toolName} is completely free with no sign-up required. Your files are processed securely.` },
      { q: `Is my data safe?`, a: "Absolutely. Most of our tools process files directly in your browser. Your files never leave your device." },
    ],
    seoText: `${toolDescription} Use our free online ${toolName} tool — no sign-up required, no software to install. Works on any device with a modern browser.`,
  };
}

export function getToolGuide(category: string, slug: string, toolName: string, toolDescription: string): ToolGuide {
  const guides: Record<string, Record<string, ToolGuide>> = {
    pdf: PDF_GUIDES,
    image: IMAGE_GUIDES,
    write: WRITE_GUIDES,
    video: VIDEO_GUIDES,
    file: FILE_GUIDES,
  };

  return guides[category]?.[slug] || getDefaultGuide(toolName, toolDescription);
}
