import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { HighlightedSolution } from "@/components/code/SolutionCode";
import { RichText } from "@/components/content/RichText";
import type { PlayerApproach } from "@/components/player/AlgorithmPlayer";
import { ApproachSection } from "@/components/problems/ApproachSection";
import { ProblemEpisode } from "@/components/problems/ProblemEpisode";
import { highlight } from "@/lib/code/highlight";
import { JsonLd } from "@/components/seo/JsonLd";
import { catalogItems, getCatalogItem, getProblem } from "@/lib/catalog";
import { resolveMarkers } from "@/lib/markers";
import { jsonLdProblem, problemDescription, problemTitle } from "@/lib/seo";
import { absUrl, site } from "@/lib/site";
import { LANGUAGES, topicLabel, type Language, type Problem } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogItems.filter((p) => p.available).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/problems/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return { robots: { index: false, follow: true } };
  const title = problemTitle(problem.id, problem.title);
  const description = problemDescription({
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    blurb: problem.blurb,
    topics: problem.topics,
  });
  const url = absUrl(`/problems/${problem.slug}`);
  return {
    title,
    description,
    keywords: [
      problem.title,
      `leetcode ${problem.id}`,
      `${problem.title} solution`,
      `${problem.title} python`,
      `${problem.title} golang`,
      `${problem.title} animation`,
      ...problem.topics.map(topicLabel),
      ...site.keywords,
    ],
    authors: [{ name: site.author, url: site.github }],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      type: "article",
      url,
      siteName: site.name,
      locale: site.locale,
      publishedTime: "2026-09-26",
      modifiedTime: "2026-09-26",
      authors: [site.author],
      tags: [...problem.topics],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
    },
    category: problem.difficulty,
  };
}

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

async function highlightApproach(
  approach: Problem["approaches"][number],
): Promise<Record<Language, HighlightedSolution>> {
  const entries = await Promise.all(
    LANGUAGES.map(
      async (lang) =>
        [
          lang,
          {
            source: approach.code[lang].source,
            highlighted: await highlight(approach.code[lang].source, lang),
          },
        ] as const,
    ),
  );
  return Object.fromEntries(entries) as Record<Language, HighlightedSolution>;
}

async function highlightAll(
  problem: Problem,
): Promise<Record<string, Record<Language, HighlightedSolution>>> {
  const entries = await Promise.all(
    problem.approaches.map(async (a) => [a.id, await highlightApproach(a)] as const),
  );
  return Object.fromEntries(entries);
}

export default async function ProblemPage({ params }: PageProps<"/problems/[slug]">) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const [playerApproaches, highlighted] = await Promise.all([
    buildPlayerApproaches(problem),
    highlightAll(problem),
  ]);
  const related = (problem.related ?? [])
    .map(getCatalogItem)
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      {jsonLdProblem(problem).map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      <ProblemEpisode
        problem={problem}
        statement={<RichText blocks={problem.statement} className="text-[15px]" />}
        insights={<RichText blocks={problem.insights} className="text-[15px]" />}
        solutionPanels={Object.fromEntries(
          problem.approaches.map((a, i) => [
            a.id,
            <ApproachSection
              key={a.id}
              approach={a}
              index={i}
              code={highlighted[a.id]!}
              compact={problem.approaches.length > 1}
            />,
          ]),
        )}
        playerApproaches={playerApproaches}
        related={related}
      />
    </>
  );
}
