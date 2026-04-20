import { loadStories, pickRandom, fetchOgImage } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { stories, generated_at } = await loadStories();
  const story = pickRandom(stories);
  const imageUrl = story.image_url ?? (await fetchOgImage(story.source_url));

  const updated = new Date(generated_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="bg-glow" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☀️</span>
          <span className="font-serif text-xl tracking-tight text-stone-900">
            Good News Generator
          </span>
        </div>
        <a
          href="/"
          className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-stone-800 backdrop-blur transition hover:border-stone-900/30 hover:bg-white"
        >
          ↻ New story
        </a>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-5xl flex-col px-6 pb-16 md:px-12">
        <div className="mb-6 flex items-center gap-2 text-sm text-stone-700">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Today&apos;s uplift
          </span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-500">{story.source_name}</span>
        </div>

        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-stone-900 md:text-7xl">
          {story.title}
        </h1>

        {imageUrl && (
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/40 shadow-[0_30px_80px_-30px_rgba(20,20,20,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={story.title}
              className="h-[360px] w-full object-cover md:h-[480px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}

        <p className="mt-10 max-w-3xl text-xl leading-relaxed text-stone-800 md:text-2xl">
          {story.summary}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href={story.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Read the full story at {story.source_name}
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 bg-white/70 px-6 py-3 text-sm font-medium text-stone-800 backdrop-blur transition hover:border-stone-900/30 hover:bg-white"
          >
            Refresh for another
          </a>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-5xl px-6 pb-10 text-xs text-stone-500 md:px-12">
        <div className="border-t border-stone-900/10 pt-6">
          Stories curated by Claude from good-news sources around the web. Last
          refreshed {updated}.
        </div>
      </footer>
    </main>
  );
}
