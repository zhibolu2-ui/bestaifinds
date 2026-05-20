#!/bin/bash
set -e

SITE_DIR="/var/www/bestaifinds"
BLOG_FILE="$SITE_DIR/src/lib/blog.ts"
API_KEY=$(grep OPENAI_API_KEY "$SITE_DIR/.env.local" | cut -d= -f2)
TODAY=$(date +%Y-%m-%d)
LOG_FILE="/var/log/baf-autopublish.log"
USED_FILE="/var/log/baf-used-topics.txt"
NEWS_CACHE="/tmp/baf-news-$(date +%Y%m%d).json"

touch "$USED_FILE"
echo "[$TODAY] === Starting auto-publish ===" >> "$LOG_FILE"

TOOL_CATEGORIES=(
  "pdf editing|PDF|pdf"
  "image processing|Image|image"
  "AI writing|AI Writing|write"
  "video editing|Video|video"
  "file conversion|File|file"
  "document management|PDF|pdf"
  "photo editing|Image|image"
  "content creation|AI Writing|write"
  "data format conversion|File|file"
  "video compression|Video|video"
)

TOOL_LINKS=(
  "pdf/merge|Merge PDF"
  "pdf/compress|Compress PDF"
  "pdf/split|Split PDF"
  "pdf/edit|Edit PDF"
  "pdf/to-word|PDF to Word"
  "pdf/esign|eSign PDF"
  "pdf/watermark|Add Watermark"
  "image/compress|Compress Image"
  "image/resize|Resize Image"
  "image/remove-bg|Remove Background"
  "image/ai-image-generator|AI Image Generator"
  "image/crop|Crop Image"
  "write/essay-writer|Essay Writer"
  "write/content-improver|Content Improver"
  "write/grammar-fixer|Grammar Fixer"
  "write/blog-post|Blog Post Generator"
  "write/translate|Translate"
  "video/compress|Compress Video"
  "video/trim|Trim Video"
  "video/to-gif|Video to GIF"
  "video/mp4-to-mp3|MP4 to MP3"
  "file/csv-to-json|CSV to JSON"
  "file/qr-code|QR Code Generator"
  "file/excel-to-pdf|Excel to PDF"
)

RSS_FEEDS=(
  "https://news.google.com/rss/search?q=online+tools+productivity&hl=en-US&gl=US&ceid=US:en"
  "https://news.google.com/rss/search?q=AI+tools+free+2026&hl=en-US&gl=US&ceid=US:en"
  "https://news.google.com/rss/search?q=PDF+editor+online&hl=en-US&gl=US&ceid=US:en"
  "https://news.google.com/rss/search?q=image+editing+AI+tools&hl=en-US&gl=US&ceid=US:en"
  "https://news.google.com/rss/search?q=video+editing+online+free&hl=en-US&gl=US&ceid=US:en"
  "https://news.google.com/rss/search?q=file+conversion+tools&hl=en-US&gl=US&ceid=US:en"
  "https://news.google.com/rss/search?q=AI+writing+assistant+2026&hl=en-US&gl=US&ceid=US:en"
  "https://news.google.com/rss/search?q=digital+document+management&hl=en-US&gl=US&ceid=US:en"
)

fetch_news() {
  local all_headlines=""

  for feed_url in "${RSS_FEEDS[@]}"; do
    local headlines=$(curl -s --max-time 10 "$feed_url" 2>/dev/null | \
      python3 -c "
import sys, re
xml = sys.stdin.read()
titles = re.findall(r'<title>(.*?)</title>', xml)
for t in titles[1:6]:
    clean = t.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '\"').replace('&#39;', \"'\")
    print(clean)
" 2>/dev/null || echo "")
    all_headlines="$all_headlines"$'\n'"$headlines"
  done

  echo "$all_headlines" | grep -v '^$' | sort -u | head -30
}

generate_topic_from_news() {
  local news_text="$1"
  local cat_info="$2"
  IFS='|' read -r cat_keyword cat_name cat_slug <<< "$cat_info"

  local random_links=""
  for link_entry in "${TOOL_LINKS[@]}"; do
    if [[ "$link_entry" == "$cat_slug/"* ]]; then
      random_links="$random_links\n- /$link_entry"
    fi
  done

  local prompt="You are a blog topic generator for BestAIFinds.com, a free online tool suite.

Here are today's trending news headlines related to online tools and technology:
$news_text

Based on these news trends, generate ONE unique blog article topic that:
1. Is inspired by or references current trends/news (mention specific trends or developments)
2. Relates to the category: $cat_name ($cat_keyword)
3. Would naturally link to tools on BestAIFinds like: $(echo -e "$random_links")
4. Is practical and helpful (how-to, guide, comparison, tips, or trend analysis)
5. Has SEO potential with searchable keywords

Respond with ONLY the article title, nothing else. No quotes, no explanation."

  local response=$(curl -s "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"model\": \"gpt-4o-mini\",
      \"messages\": [{\"role\": \"user\", \"content\": $(echo "$prompt" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}],
      \"max_tokens\": 100,
      \"temperature\": 0.9
    }" 2>/dev/null)

  echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(data['choices'][0]['message']['content'].strip())
" 2>/dev/null
}

generate_article() {
  local topic="$1"
  local category="$2"
  local news_context="$3"
  local slug=$(echo "$topic" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | sed 's/--*/-/g' | cut -c1-60)

  local cat_links=""
  for link_entry in "${TOOL_LINKS[@]}"; do
    IFS='|' read -r path name <<< "$link_entry"
    cat_links="$cat_links\n- [$name](https://bestaifinds.com/$path)"
  done

  local prompt="Write a 1000-1200 word SEO-optimized blog article for BestAIFinds.com about: $topic

IMPORTANT CONTEXT - Use these current news/trends as references in the article:
$news_context

Requirements:
- Start with a compelling introduction that references current trends or recent developments
- Use markdown headings (## for sections, ### for subsections)
- Include 4-6 practical sections with actionable advice
- Cite or reference real industry trends, statistics, or developments where relevant
- Naturally mention BestAIFinds tools where appropriate
- Include relevant tool links from BestAIFinds: $(echo -e "$cat_links")
- Write in a friendly, professional, authoritative tone
- Include relevant keywords naturally for SEO
- End with a practical conclusion and call-to-action
- Do NOT use any emoji
- Do NOT make up fake statistics - only reference trends you know are real
- The article should feel current and timely, not generic"

  local response=$(curl -s "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"model\": \"gpt-4o-mini\",
      \"messages\": [{\"role\": \"user\", \"content\": $(echo "$prompt" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}],
      \"max_tokens\": 2500,
      \"temperature\": 0.7
    }" 2>/dev/null)

  local content=$(echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
text = data['choices'][0]['message']['content']
escaped = text.replace('\\\\', '\\\\\\\\').replace('\`', '\\\\\`').replace('\${', '\\\\\${')
print(escaped)
" 2>/dev/null)

  if [ -z "$content" ]; then
    echo "[$TODAY] Failed to generate article: $topic" >> "$LOG_FILE"
    return 1
  fi

  local excerpt=$(echo "$content" | head -3 | tr '\n' ' ' | sed 's/^#* *//' | cut -c1-150)

  local ts_entry="  {
    slug: \"$slug\",
    title: \"$(echo "$topic" | sed 's/"/\\"/g')\",
    excerpt: \"$(echo "$excerpt" | sed 's/"/\\"/g')...\",
    category: \"$category\",
    date: \"$TODAY\",
    author: \"BestAIFinds Team\",
    readTime: \"6 min read\",
    image: \"📝\",
    content: \`$content\`,
  },"

  local insert_line=$(grep -n "^];$" "$BLOG_FILE" | head -1 | cut -d: -f1)
  if [ -n "$insert_line" ]; then
    sed -i "${insert_line}i\\$ts_entry" "$BLOG_FILE"
    echo "[$TODAY] Published: $slug ($topic)" >> "$LOG_FILE"
    return 0
  else
    echo "[$TODAY] Could not find insert point in blog.ts" >> "$LOG_FILE"
    return 1
  fi
}

echo "[$TODAY] Fetching latest news..." >> "$LOG_FILE"
NEWS=$(fetch_news)
NEWS_COUNT=$(echo "$NEWS" | wc -l)
echo "[$TODAY] Fetched $NEWS_COUNT news headlines" >> "$LOG_FILE"

if [ -z "$NEWS" ] || [ "$NEWS_COUNT" -lt 3 ]; then
  NEWS="AI tools continue to transform online productivity in 2026
Free browser-based tools gain popularity over expensive software subscriptions
PDF editing and document management tools see growing demand
Image processing AI capabilities improve dramatically
Video editing becomes accessible with free online tools
Content creation with AI assistants reaches new levels
File format conversion tools become essential for modern workflows"
  echo "[$TODAY] Using fallback news context" >> "$LOG_FILE"
fi

published=0
attempts=0
max_attempts=8

while [ $published -lt 3 ] && [ $attempts -lt $max_attempts ]; do
  attempts=$((attempts + 1))

  cat_index=$(( (RANDOM + attempts) % ${#TOOL_CATEGORIES[@]} ))
  cat_info="${TOOL_CATEGORIES[$cat_index]}"
  IFS='|' read -r _ cat_name _ <<< "$cat_info"

  echo "[$TODAY] Generating topic #$((published+1)) for category: $cat_name..." >> "$LOG_FILE"

  topic=$(generate_topic_from_news "$NEWS" "$cat_info")

  if [ -z "$topic" ]; then
    echo "[$TODAY] Topic generation failed, retrying..." >> "$LOG_FILE"
    sleep 3
    continue
  fi

  if grep -qF "$topic" "$USED_FILE" 2>/dev/null; then
    echo "[$TODAY] Topic already used: $topic" >> "$LOG_FILE"
    continue
  fi

  echo "[$TODAY] Writing article: $topic" >> "$LOG_FILE"

  if generate_article "$topic" "$cat_name" "$NEWS"; then
    echo "$topic" >> "$USED_FILE"
    published=$((published + 1))
    echo "[$TODAY] Article $published/3 completed" >> "$LOG_FILE"
    sleep 5
  fi
done

if [ $published -gt 0 ]; then
  cd "$SITE_DIR"
  echo "[$TODAY] Building site..." >> "$LOG_FILE"
  npx next build 2>&1 | tail -3 >> "$LOG_FILE"
  pm2 restart bestaifinds >> "$LOG_FILE" 2>&1
  echo "[$TODAY] Deployed $published new articles successfully" >> "$LOG_FILE"
else
  echo "[$TODAY] No articles published" >> "$LOG_FILE"
fi

echo "[$TODAY] === Auto-publish complete ===" >> "$LOG_FILE"
