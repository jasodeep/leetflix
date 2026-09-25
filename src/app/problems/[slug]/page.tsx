import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InlineMarkdown } from "@/components/content/InlineMarkdown";
import { RichText } from "@/components/content/RichText";
import { AlgorithmPlayer, type PlayerApproach } from "@/components/player/AlgorithmPlayer";
import { ApproachSection } from "@/components/problems/ApproachSection";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { TableOfContents } from "@/components/problems/TableOfContents";
import { DifficultyBadge, Chip } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Viz } from "@/components/viz/Viz";
import { highlight } from "@/lib/code/highlight";
import { resolveMarkers } from "@/lib/markers";
import { getAllProblems, getCatalogItem, getProblem } from "@/lib/problems";
import { absUrl, leetcodeUrl, site } from "@/lib/site";
import { LANGUAGES, type Problem } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProblems().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/problems/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return {};
  const title = `${problem.id}. ${problem.title}`;
  const description = `${problem.title} (${problem.difficulty}) explained in depth, with Python and Go solutions and an interactive step-by-step animation. ${problem.blurb}`;
  return {
    title,
    description,
    alternates: { canonical: absUrl(`/problems/${problem.slug}`) },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      type: "article",
      url: absUrl(`/problems/${problem.slug}`),
    },
  };
}

const sections = [
  { id: "statement", label: "Problem" },
  { id: "examples", label: "Examples" },
  { id: "insights", label: "Understanding it" },
  { id: "approaches", label: "Solutions" },
  { id: "walkthrough", label: "Animation" },
] as const;

async function buildPlayerApproaches(problem: Problem): Promise<PlayerApproach[]> {
  return Promise.all(
    problem.approaches
      .filter((a) => a.traceable)
      .map(async (a) => {
        const code = await Promise.all(
          LANGUAGES.map(
            async (lang) =>
              [
                lang,
                {
                  highlighted: await highlight(a.code[lang].source, lang),
                  markers: resolveMarkers(a.code[lang], `${problem.slug}/${a.id}/${lang}`),
                },
              ] as const,
          ),
        );
        return {
          id: a.id,
          title: a.title,
          kind: a.kind,
          code: Object.fromEntries(code) as PlayerApproach["code"],
        };
      }),
  );
}

export default async function ProblemPage({ params }: PageProps<"/problems/[slug]">) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const playerApproaches = await buildPlayerApproaches(problem);
  const related = (problem.related ?? [])
    .map(getCatalogItem)
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${problem.id}. ${problem.title}`,
    description: problem.blurb,
    proficiencyLevel: problem.difficulty,
    keywords: problem.topics.join(", "),
    programmingLanguage: ["Python", "Go"],
    url: absUrl(`/problems/${problem.slug}`),
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-border space-y-5 border-b pb-8">
        <nav className="text-fg-subtle font-mono text-xs" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-fg inline-flex items-center gap-1.5">
            <ArrowLeft className="size-3" aria-hidden /> All problems
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fg-muted">#{problem.id}</span>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-fg text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="text-fg-subtle mr-3 font-mono text-2xl sm:text-3xl">
                {problem.id}.
              </span>
              {problem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={problem.difficulty} />
              {problem.topics.map((t) => (
                <Link key={t} href={`/?topic=${encodeURIComponent(t)}`} className="rounded-full">
                  <Chip>{t}</Chip>
                </Link>
              ))}
            </div>
          </div>
          <a
            href={leetcodeUrl(problem.slug)}
            target="_blank"
            rel="noreferrer"
            className="border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors"
          >
            Solve on LeetCode <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
        <p className="text-fg-muted max-w-3xl text-lg leading-8">{problem.blurb}</p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="min-w-0 space-y-16">
          <section id="statement" className="scroll-mt-24 space-y-6">
            <h2 className="text-fg text-2xl font-semibold tracking-tight">Problem</h2>
            <RichText blocks={problem.statement} className="text-[15px]" />
            <div className="rounded-card border-border bg-surface border p-5">
              <h3 className="text-fg-subtle mb-3 font-mono text-[11px] tracking-wider uppercase">
                Constraints
              </h3>
              <ul className="prose-code text-fg-muted space-y-1.5 text-sm leading-6">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-fg-subtle select-none">—</span>
                    <InlineMarkdown text={c} />
                  </li>
                ))}
              </ul>
              {problem.followUp && (
                <p className="prose-code border-border text-fg-muted mt-4 border-t pt-3 text-sm leading-6">
                  <span className="text-fg font-medium">Follow-up: </span>
                  <InlineMarkdown text={problem.followUp} />
                </p>
              )}
            </div>
          </section>

          <section id="examples" className="scroll-mt-24 space-y-6">
            <h2 className="text-fg text-2xl font-semibold tracking-tight">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((ex, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.05}
                  className="rounded-card border-border bg-surface overflow-hidden border"
                >
                  <div className="grid gap-4 p-5 sm:grid-cols-2">
                    <div>
                      <h3 className="text-fg-subtle mb-2 font-mono text-[11px] tracking-wider uppercase">
                        Example {i + 1} · Input
                      </h3>
                      <dl className="space-y-1 font-mono text-sm">
                        {Object.entries(ex.input).map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <dt className="text-fg-muted">{k} =</dt>
                            <dd className="text-fg break-all">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-fg-subtle mb-2 font-mono text-[11px] tracking-wider uppercase">
                        Output
                      </h3>
                      <p className="text-viz-green font-mono text-sm">{ex.output}</p>
                    </div>
                  </div>
                  {(ex.viz || ex.explanation) && (
                    <div className="border-border bg-bg/40 space-y-4 border-t p-5">
                      {ex.viz && <Viz state={ex.viz} />}
                      {ex.explanation && (
                        <p className="prose-code text-fg-muted text-sm leading-6">
                          <InlineMarkdown text={ex.explanation} />
                        </p>
                      )}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </section>

          <section id="insights" className="scroll-mt-24 space-y-6">
            <h2 className="text-fg text-2xl font-semibold tracking-tight">
              Understanding the problem
            </h2>
            <Reveal>
              <RichText blocks={problem.insights} className="text-[15px]" />
            </Reveal>
          </section>

          <section id="approaches" className="scroll-mt-24 space-y-12">
            <div className="space-y-2">
              <h2 className="text-fg text-2xl font-semibold tracking-tight">Solutions</h2>
              <p className="text-fg-muted">
                {problem.approaches.length} approach{problem.approaches.length === 1 ? "" : "es"},
                each in Python and Go. Toggle the language once — it sticks everywhere.
              </p>
            </div>
            {problem.approaches.map((a, i) => (
              <Reveal key={a.id}>
                <ApproachSection approach={a} index={i} />
              </Reveal>
            ))}
          </section>

          <section id="walkthrough" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <h2 className="text-fg text-2xl font-semibold tracking-tight">
                Interactive walkthrough
              </h2>
              <p className="text-fg-muted">
                Edit the input, press <span className="text-fg font-mono">Run</span>, then play or
                scrub through every step. The highlighted line is the one executing.
              </p>
            </div>
            {playerApproaches.length > 0 ? (
              <AlgorithmPlayer
                slug={problem.slug}
                approaches={playerApproaches}
                inputs={problem.inputs}
              />
            ) : (
              <p className="rounded-card border-border text-fg-muted border border-dashed p-6 text-sm">
                No animated approach for this problem yet.
              </p>
            )}
          </section>

          {related.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-fg text-2xl font-semibold tracking-tight">Up next</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <ProblemCard key={item.slug} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <TableOfContents sections={sections} />
          </div>
        </aside>
      </div>
    </div>
  );
}
