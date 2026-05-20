#!/bin/bash
set -e

SITE_DIR="/var/www/bestaifinds"
BLOG_FILE="$SITE_DIR/src/lib/blog.ts"
API_KEY=$(grep OPENAI_API_KEY "$SITE_DIR/.env.local" | cut -d= -f2)
TODAY=$(date +%Y-%m-%d)
LOG_FILE="/var/log/baf-autopublish.log"

TOPICS=(
  "How to compress PDF files for email attachments|PDF|pdf/compress"
  "Best practices for resizing images for websites|Image|image/resize"
  "AI writing vs human writing: when to use each|AI Writing|write/content-improver"
  "How to create animated GIFs from screen recordings|Video|video/to-gif"
  "Base64 encoding explained: what it is and when to use it|File|file/base64"
  "PDF watermarks: protect your documents from unauthorized sharing|PDF|pdf/watermark"
  "Image optimization for faster website loading|Image|image/compress"
  "How to use AI to improve your resume and cover letter|AI Writing|write/content-improver"
  "Converting video formats: complete compatibility guide|Video|video/mov-to-mp4"
  "Excel to PDF conversion: preserve formatting perfectly|File|file/excel-to-pdf"
  "How to add page numbers to PDF documents|PDF|pdf/page-numbers"
  "Creating transparent PNG images without Photoshop|Image|image/remove-bg"
  "AI blog post generator: create SEO content in minutes|AI Writing|write/blog-post"
  "Trim and cut videos online without installing software|Video|video/trim"
  "JSON formatting and validation: a developer guide|File|file/csv-to-json"
  "Digital signatures on PDFs: legal validity and how to|PDF|pdf/esign"
  "Batch image processing: resize multiple photos at once|Image|image/resize"
  "Content summarization with AI: save hours of reading|AI Writing|write/content-summarizer"
  "Mute video audio: remove sound from video clips|Video|video/mute"
  "Word counter tools: why character count matters for SEO|File|file/word-counter"
  "How to rotate PDF pages in the correct orientation|PDF|pdf/rotate"
  "Black and white photo effects: artistic image editing|Image|image/black-white"
  "AI story generator: creative writing prompts and tools|AI Writing|write/story-generator"
  "Convert WEBM to MP4: fix browser video compatibility|Video|video/webm-to-mp4"
  "Epoch timestamp converter: Unix time made simple|File|file/epoch-converter"
  "Delete specific pages from PDF without desktop software|PDF|pdf/delete-pages"
  "Pixelate images for privacy: blur faces and sensitive info|Image|image/pixelate"
  "Translate documents with AI: break language barriers|AI Writing|write/translate"
  "Extract audio tracks from video files as MP3|Video|video/extract-audio"
  "XML to JSON conversion for API migration|File|file/xml-to-json"
  "Rearrange PDF pages: reorder your document easily|PDF|pdf/rearrange"
  "Add text overlays to images: create social media graphics|Image|image/add-text"
  "Paragraph writing with AI: overcome writer block|AI Writing|write/paragraph-writer"
  "AVI to MP4 conversion: modernize old video files|Video|video/avi-to-mp4"
  "CSV to Excel: import data into spreadsheets properly|File|file/csv-to-excel"
  "Crop PDF pages to remove margins and whitespace|PDF|pdf/crop"
  "Combine multiple images into one collage|Image|image/combine"
  "Sentence rewriter: improve your writing style with AI|AI Writing|write/sentence-rewriter"
  "Resize video dimensions for different social platforms|Video|video/resize"
  "JSON to XML: working with legacy enterprise systems|File|file/json-to-xml"
  "JPG to PDF: convert photos into document format|PDF|pdf/from-images"
  "Flip images horizontally for mirror selfies|Image|image/flip"
  "Tone of voice changer: adjust your writing style with AI|AI Writing|write/tone-of-voice"
  "Compress large video files for cloud storage|Video|video/compress"
  "XML to CSV: flatten hierarchical data into tables|File|file/xml-to-csv"
)

generate_article() {
  local topic="$1"
  local category="$2"
  local tool_path="$3"
  local slug=$(echo "$topic" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | cut -c1-60)

  local prompt="Write a 800-1000 word SEO-optimized blog article about: $topic

Requirements:
- Use markdown headings (## for sections)
- Include practical tips and step-by-step instructions
- Mention BestAIFinds as the recommended tool
- End with a call-to-action linking to /$tool_path
- Write in a friendly, professional tone
- Include relevant keywords naturally
- Do NOT use any emoji"

  local response=$(curl -s "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"model\": \"gpt-4o-mini\",
      \"messages\": [{\"role\": \"user\", \"content\": $(echo "$prompt" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}],
      \"max_tokens\": 2000,
      \"temperature\": 0.7
    }")

  local content=$(echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
text = data['choices'][0]['message']['content']
escaped = text.replace('\\\\', '\\\\\\\\').replace('\`', '\\\\\`').replace('\${', '\\\\\${')
print(escaped)
" 2>/dev/null)

  if [ -z "$content" ]; then
    echo "[$TODAY] Failed to generate: $topic" >> "$LOG_FILE"
    return 1
  fi

  local excerpt=$(echo "$content" | head -3 | tr '\n' ' ' | cut -c1-150)

  local ts_entry="  {
    slug: \"$slug\",
    title: \"$(echo "$topic" | sed 's/"/\\"/g')\",
    excerpt: \"$(echo "$excerpt" | sed 's/"/\\"/g')...\",
    category: \"$category\",
    date: \"$TODAY\",
    author: \"BestAIFinds Team\",
    readTime: \"5 min read\",
    image: \"📝\",
    content: \`$content\`,
  },"

  local insert_line=$(grep -n "^];$" "$BLOG_FILE" | head -1 | cut -d: -f1)
  if [ -n "$insert_line" ]; then
    sed -i "${insert_line}i\\$ts_entry" "$BLOG_FILE"
    echo "[$TODAY] Published: $slug" >> "$LOG_FILE"
    return 0
  else
    echo "[$TODAY] Could not find insert point in blog.ts" >> "$LOG_FILE"
    return 1
  fi
}

USED_FILE="/var/log/baf-used-topics.txt"
touch "$USED_FILE"

published=0
for topic_entry in "${TOPICS[@]}"; do
  if [ $published -ge 3 ]; then break; fi

  IFS='|' read -r topic category tool_path <<< "$topic_entry"

  if grep -qF "$topic" "$USED_FILE" 2>/dev/null; then
    continue
  fi

  if generate_article "$topic" "$category" "$tool_path"; then
    echo "$topic" >> "$USED_FILE"
    published=$((published + 1))
    sleep 5
  fi
done

if [ $published -gt 0 ]; then
  cd "$SITE_DIR"
  npx next build 2>&1 | tail -3 >> "$LOG_FILE"
  pm2 restart bestaifinds >> "$LOG_FILE" 2>&1
  echo "[$TODAY] Deployed $published new articles" >> "$LOG_FILE"
fi
