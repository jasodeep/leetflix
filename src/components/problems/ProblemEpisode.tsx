"use client";

import { ArrowLeft, ChevronDown, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import { InlineMarkdown } from "@/components/content/InlineMarkdown";
import { AlgorithmPlayer, type PlayerApproach } from "@/components/player/AlgorithmPlayer";
import { ActNav } from "@/components/problems/ActNav";
import { ExampleDeck } from "@/components/problems/ExampleDeck";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { SolutionTabs } from "@/components/problems/SolutionTabs";
import { Chip, DifficultyBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { leetcodeUrl } from "@/lib/site";
import { isProblemType, topicLabel, type CatalogItem, type Problem } from "@/lib/types";

const fadeEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: fadeEase },
  }),
};

function ActHead({ n, title, kicker }: { n: string; title: string; kicker: string }) {
  return (
    <header className="mb-6 space-y-1.5">
      <p className="text-brand font-mono text-[11px] tracking-[0.2em]">{n}</p>
      <h2 className="text-fg text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-fg-muted text-sm leading-6">{kicker}</p>
    </header>
  );
}

export function ProblemEpisode({
  problem,
  statement,
  insights,
  solutionPanels,
  playerApproaches,
  related,
}: {
  problem: Problem;
  statement: ReactNode;
  insights: ReactNode;
  solutionPanels: Record<string, ReactNode>;
  playerApproaches: PlayerApproach[];
  related: CatalogItem[];
}) {
  const defaultId = useMemo(
    () => (problem.approaches.find((a) => a.kind === "optimal") ?? problem.approaches[0])!.id,
    [problem.approaches],
  );
  const [approachId, setApproachId] = useState(defaultId);
  const [ideasOpen, setIdeasOpen] = useState(false);
  const playing = problem.approaches.find((a) => a.id === approachId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.header initial="hidden" animate="show" className="relative mb-8 overflow-hidden pb-2">
        <span
          className="text-fg/4 font-display pointer-events-none absolute -top-6 -left-2 text-[9rem] leading-none select-none"
          aria-hidden
        >
          {problem.id}
        </span>
        <motion.nav
          custom={0}
          variants={fadeUp}
          className="text-fg-subtle relative mb-5 font-mono text-xs"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-fg inline-flex items-center gap-1.5">
            <ArrowLeft className="size-3" aria-hidden /> All problems
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fg-muted">#{problem.id}</span>
        </motion.nav>
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-fg text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              {problem.title}
            </motion.h1>
            <motion.div custom={2} variants={fadeUp} className="flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={problem.difficulty} />
              {problem.topics.map((t) => (
                <Link
                  key={t}
                  href={
                    isProblemType(t)
                      ? `/?type=${encodeURIComponent(t)}`
                      : `/?method=${encodeURIComponent(t)}`
                  }
                  className="rounded-full"
                >
                  <Chip>{topicLabel(t)}</Chip>
                </Link>
              ))}
            </motion.div>
          </div>
          <motion.a
            custom={2}
            variants={fadeUp}
            href={leetcodeUrl(problem.slug)}
            target="_blank"
            rel="noreferrer"
            className="border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors"
          >
            Solve on LeetCode <ExternalLink className="size-3.5" aria-hidden />
          </motion.a>
        </div>
        <motion.p
          custom={3}
          variants={fadeUp}
          className="text-fg-muted relative mt-4 max-w-3xl text-lg leading-8"
        >
          {problem.blurb}
        </motion.p>
      </motion.header>

      <ActNav />

      <div className="space-y-20">
        <section id="statement" className="scroll-mt-32">
          <ActHead
            n="01"
            title="Problem"
            kicker="Read the prompt, flip through the examples, then steal the idea."
          />
          <Reveal>
            <div
              className="rounded-card border-border bg-surface/80 pointer-glow relative space-y-6 overflow-hidden border p-5 sm:p-6"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              {statement}
              <div>
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
            </div>
          </Reveal>

          <div className="mt-8">
            <h3 className="text-fg mb-4 text-lg font-semibold tracking-tight">Examples</h3>
            <ExampleDeck examples={problem.examples} />
          </div>

          {problem.insights.length > 0 && (
            <div className="mt-8">
              <button
                type="button"
                aria-expanded={ideasOpen}
                onClick={() => setIdeasOpen((v) => !v)}
                className="text-fg-muted hover:text-fg flex items-center gap-2 text-sm font-medium"
              >
                <ChevronDown className={cnChevron(ideasOpen)} aria-hidden />
                The idea
              </button>
              <AnimatePresence initial={false}>
                {ideasOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-border bg-surface/60 rounded-card mt-4 border p-5 sm:p-6">
                      {insights}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>

        <section id="solution" className="scroll-mt-32">
          <ActHead
            n="02"
            title="Solution"
            kicker={
              problem.approaches.length > 1
                ? `${problem.approaches.length} approaches · Python and Go. Pick a tab — the walkthrough follows.`
                : "Python and Go. The walkthrough below runs this same code."
            }
          />
          <Reveal>
            <SolutionTabs
              approaches={problem.approaches}
              panels={solutionPanels}
              activeId={approachId}
              onChange={setApproachId}
            />
          </Reveal>
        </section>

        <section id="walkthrough" className="scroll-mt-32">
          <ActHead
            n="03"
            title="Interactive walkthrough"
            kicker={
              playing
                ? `Playing “${playing.title}”. Edit the input, hit Run, then scrub.`
                : "Edit the input, press Run, then play or step through every line."
            }
          />
          {playerApproaches.length > 0 ? (
            <Reveal>
              <AlgorithmPlayer
                slug={problem.slug}
                approaches={playerApproaches}
                inputs={problem.inputs}
                approachId={approachId}
                onApproachChange={setApproachId}
              />
            </Reveal>
          ) : (
            <p className="rounded-card border-border text-fg-muted border border-dashed p-6 text-sm">
              No animated approach for this problem yet.
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-fg text-xl font-semibold tracking-tight">Up next</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProblemCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const cnChevron = (open: boolean) =>
  `size-4 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`;
