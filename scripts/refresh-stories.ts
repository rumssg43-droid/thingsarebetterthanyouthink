import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs/promises";
import path from "node:path";

// Generous timeout for long agentic web-search runs.
const client = new Anthropic({ timeout: 600_000 });

const SOURCES = [
  "goodnewsnetwork.org",
  "positive.news",
  "reasonstobecheerful.world",
  "upworthy.com",
  "sunnyskyz.com",
  "theoptimistdaily.com",
];

const STORY_COUNT = 20;

const prompt = `Find ${STORY_COUNT} recent, genuinely uplifting positive-news stories from these sources:

${SOURCES.map((s) => `- ${s}`).join("\n")}

Vary the topics widely: scientific breakthroughs, medical advances, acts of kindness, environmental wins, animal rescues, community triumphs, underdog stories, human achievements. Favor recent articles (past few months) and stories that are genuinely heartwarming or inspiring — not puff pieces.

Use ONLY web_search — do NOT use web_fetch. Search-result snippets are enough to craft a title and summary; we'll get article images later. Each story must link to the actual article page (not a category/tag/aggregator page).

When you have ${STORY_COUNT} stories, output a single JSON code block with this exact shape. No prose after the JSON.

\`\`\`json
{
  "stories": [
    {
      "title": "Catchy, punchy title (rewrite for impact if the original is bland)",
      "summary": "2-3 sentence summary of what happened and why it's good news",
      "source_name": "Good News Network",
      "source_url": "https://www.goodnewsnetwork.org/..."
    }
  ]
}
\`\`\``;

function extractJsonBlock(text: string): string | null {
  const fenced = text.match(/```json\s*\n([\s\S]*?)\n```/);
  if (fenced) return fenced[1];
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }
  return null;
}

type Story = {
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  image_url: string | null;
};

type ClaudeStory = Omit<Story, "image_url">;

async function main() {
  console.log(`Asking Claude to find ${STORY_COUNT} good news stories...`);
  const started = Date.now();

  let messages: Anthropic.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  let finalText = "";
  let turns = 0;

  while (turns < 8) {
    turns += 1;
    const stream = client.messages.stream({
      model: "claude-opus-4-7",
      max_tokens: 16000,
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages,
    });

    stream.on("text", (delta) => {
      process.stdout.write(delta);
    });

    const message = await stream.finalMessage();
    console.log();
    console.log(
      `  [turn ${turns}] stop_reason=${message.stop_reason}  in=${message.usage.input_tokens} out=${message.usage.output_tokens}`,
    );

    if (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content });
      continue;
    }

    for (const block of message.content) {
      if (block.type === "text") finalText += block.text;
    }
    break;
  }

  const jsonText = extractJsonBlock(finalText);
  if (!jsonText) {
    console.error("Could not find JSON in the response. Raw:");
    console.error(finalText.slice(0, 2000));
    process.exit(1);
  }

  let parsed: { stories: ClaudeStory[] };
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    console.error("JSON parse failed:", err);
    console.error(jsonText.slice(0, 2000));
    process.exit(1);
  }

  const stories: Story[] = parsed.stories
    .filter((s) => s.title && s.summary && s.source_url)
    .map((s) => ({ ...s, image_url: null }));

  const outputPath = path.join(process.cwd(), "data", "stories.json");
  const payload = {
    generated_at: new Date().toISOString(),
    count: stories.length,
    stories,
  };
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2) + "\n");

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\nSaved ${stories.length} stories to ${outputPath} in ${secs}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
