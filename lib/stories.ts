import fs from "node:fs/promises";
import path from "node:path";

export type Story = {
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  image_url: string | null;
};

export type StoriesFile = {
  generated_at: string;
  count: number;
  stories: Story[];
};

export async function loadStories(): Promise<StoriesFile> {
  const p = path.join(process.cwd(), "data", "stories.json");
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw) as StoriesFile;
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GoodNewsGenerator/1.0; +https://goodnewsgenerator.com)",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      ) ||
      html.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      );
    if (!match) return null;
    const src = match[1];
    try {
      return new URL(src, url).toString();
    } catch {
      return src;
    }
  } catch {
    return null;
  }
}
