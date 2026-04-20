import { loadStories, pickRandom, fetchOgImage } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { stories, generated_at } = await loadStories();
  const story = pickRandom(stories);
  const imageUrl = story.image_url ?? (await fetchOgImage(story.source_url));

  const updated = new Date(generated_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <a
            href="/"
            className="font-serif text-[15px] leading-none tracking-tight text-ink md:text-base"
          >
            Things Are Better
            <span className="text-accent"> Than You Think</span>
          </a>
          <a
            href="/"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink/70 transition hover:text-ink"
          >
            Another reason
            <span
              aria-hidden
              className="inline-block transition group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-12 md:px-10 md:pt-20">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-ink/50">
          <span className="text-accent">The Evidence</span>
          <span aria-hidden>·</span>
          <span>{story.source_name}</span>
        </div>

        <h1 className="font-serif mt-7 text-4xl leading-[1.08] tracking-tight text-ink md:text-6xl md:leading-[1.03]">
          {story.title}
        </h1>

        {imageUrl && (
          <figure className="mt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={story.title}
              className="aspect-[16/10] w-full border border-ink/10 object-cover"
            />
          </figure>
        )}

        <p className="mt-12 font-serif text-xl leading-[1.55] text-ink/90 md:text-[1.6rem] md:leading-[1.5]">
          {story.summary}
        </p>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink/10 pt-8 md:flex-row md:items-center md:gap-6">
          <a
            href={story.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 self-start border border-ink bg-ink px-5 py-3 text-[13px] font-medium text-cream transition hover:bg-accent hover:border-accent"
          >
            Read the full story
            <span
              aria-hidden
              className="transition group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 self-start border border-ink/20 px-5 py-3 text-[13px] font-medium text-ink transition hover:border-ink"
          >
            Show me another
          </a>
        </div>
      </article>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-ink/60 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="max-w-lg">
            An evidence-based antidote to the doom cycle. Curated by Claude from
            Our World in Data, Fix The News, Human Progress, and other rigorous
            progress journalism.
          </p>
          <p className="uppercase tracking-[0.18em]">
            Refreshed {updated}
          </p>
        </div>
      </footer>
    </main>
  );
}
