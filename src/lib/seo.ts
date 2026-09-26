import { catalogItems } from "@/lib/problems";
import { absUrl, leetcodeUrl, site } from "@/lib/site";
import {
  DIFFICULTIES,
  METHODS,
  PROBLEM_TYPES,
  topicLabel,
  type Difficulty,
  type Problem,
  type Topic,
} from "@/lib/types";

export const SITE_UPDATED = "2026-09-26";

export const topicSlug = (topic: string): string =>
  topic
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export interface SeoHub {
  slug: string;
  kind: "difficulty" | "type" | "method";
  label: string;
  title: string;
  description: string;
  difficulty?: Difficulty;
  topic?: Topic;
}

const difficultyCopy: Record<Difficulty, { title: string; description: string }> = {
  Easy: {
    title: "Easy LeetCode problems — animated solutions",
    description:
      "Every Easy LeetCode problem in one catalogue. Filter to animated walkthroughs for visual, well-explained Python and Go solutions you can step through.",
  },
  Medium: {
    title: "Medium LeetCode problems — animated solutions",
    description:
      "The Medium LeetCode set, listed in full. Watch pattern-heavy solutions as interactive animations with Python and Go code beside every step.",
  },
  Hard: {
    title: "Hard LeetCode problems — animated solutions",
    description:
      "Hard LeetCode problems collected in one place. Scrub visual walkthroughs of the toughest patterns, with explained Python and Go implementations.",
  },
};

const typeBlurb = (label: string) =>
  `Every LeetCode problem tagged ${label} — the full catalogue, plus animated visual solutions in Python and Go when a deep-dive exists.`;

const methodBlurb = (label: string) =>
  `LeetCode problems solved with ${label}. Browse the complete tag, then watch the algorithm move — step-by-step animation, Python and Go.`;

const ALL_HUBS: readonly SeoHub[] = [
  ...DIFFICULTIES.map((difficulty) => ({
    slug: topicSlug(difficulty),
    kind: "difficulty" as const,
    label: difficulty,
    title: difficultyCopy[difficulty].title,
    description: difficultyCopy[difficulty].description,
    difficulty,
  })),
  ...PROBLEM_TYPES.map((topic) => ({
    slug: topicSlug(topic),
    kind: "type" as const,
    label: topicLabel(topic),
    title: `${topic} LeetCode problems — visual solutions`,
    description: typeBlurb(topic),
    topic,
  })),
  ...METHODS.map((topic) => ({
    slug: topicSlug(topic),
    kind: "method" as const,
    label: topicLabel(topic),
    title: `${topic} — animated LeetCode walkthroughs`,
    description: methodBlurb(topic),
    topic,
  })),
];

export const itemsForHub = (hub: SeoHub) =>
  catalogItems.filter((item) => {
    if (hub.difficulty) return item.difficulty === hub.difficulty;
    if (hub.topic) return item.topics.includes(hub.topic);
    return false;
  });

/** Skip tags the catalogue dump has not populated yet — empty hubs are thin pages. */
export const SEO_HUBS: readonly SeoHub[] = ALL_HUBS.filter((hub) => itemsForHub(hub).length > 0);

const hubBySlug = new Map(SEO_HUBS.map((h) => [h.slug, h]));

export const hubOf = (slug: string): SeoHub | undefined => hubBySlug.get(slug);

export const catalogStats = () => {
  const animated = catalogItems.filter((i) => i.available);
  return {
    total: catalogItems.length,
    animated: animated.length,
    locked: catalogItems.filter((i) => i.premium).length,
    easy: catalogItems.filter((i) => i.difficulty === "Easy").length,
    medium: catalogItems.filter((i) => i.difficulty === "Medium").length,
    hard: catalogItems.filter((i) => i.difficulty === "Hard").length,
  };
};

export const FEATURED_SLUGS = [
  "two-sum",
  "add-two-numbers",
  "trapping-rain-water",
  "valid-parentheses",
  "number-of-islands",
  "longest-substring-without-repeating-characters",
] as const;

export const HOME_FAQ = [
  {
    q: "Does Leetflix cover every LeetCode problem?",
    a: "Yes — the catalogue lists every public LeetCode problem. Every free row opens an animated Python and Go walkthrough. Locked (Premium) problems stay listed and deep-link to LeetCode.",
  },
  {
    q: "How does this help with coding interviews?",
    a: "You practice the same data-structure and algorithm patterns asked in software-engineer interviews — arrays, hashing, two pointers, trees, graphs, dynamic programming — with a visual walkthrough so the invariant is obvious before you write it on a whiteboard.",
  },
  {
    q: "How are the solutions explained?",
    a: "Each deep-dive has a written problem statement, worked examples, a well-explained Python and Go implementation, and an interactive walkthrough. You edit the input, press Run, and step the algorithm one instruction at a time.",
  },
  {
    q: "What is the difference versus reading an editorial?",
    a: "The catch is motion. Data structures light up as the code runs — arrays, hash maps, stacks, linked lists, grids — so you see why an invariant holds, not just that the answer is correct.",
  },
  {
    q: "Which languages are the solutions in?",
    a: "Python and Go on every deep-dive. The language toggle is site-wide, so the static solution and the animation stay in the same language.",
  },
  {
    q: "Is Leetflix free?",
    a: "Yes. It is a static site. No account, no paywall. Official problem statements remain on LeetCode; we teach the algorithm.",
  },
] as const;

export const problemTitle = (id: number, title: string): string =>
  `${id}. ${title} — animated solution`;

export const problemDescription = (opts: {
  id: number;
  title: string;
  difficulty: Difficulty;
  blurb: string;
  topics: readonly Topic[];
}): string => {
  const tags = opts.topics.slice(0, 3).map(topicLabel).join(", ");
  const lead = `Watch LeetCode ${opts.id}. ${opts.title} (${opts.difficulty}) solved visually.`;
  const rest = `Step-by-step algorithm animation with a well-explained Python and Go solution${tags ? ` — ${tags}` : ""}.`;
  const raw = `${lead} ${rest} ${opts.blurb}`;
  return raw.length > 158 ? `${raw.slice(0, 155).trim()}…` : raw;
};

export const jsonLdWebsite = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  alternateName: [
    "Leetflix",
    "Leetflix LeetCode solutions",
    "Leetflix interview prep",
    "Leetflix algorithm visualizations",
  ],
  url: absUrl("/"),
  description: site.description,
  about: [
    { "@type": "Thing", name: "LeetCode" },
    { "@type": "Thing", name: "Coding interviews" },
    { "@type": "Thing", name: "Data structures and algorithms" },
    { "@type": "Thing", name: "Problem solving" },
  ],
  inLanguage: site.localeBcp47,
  publisher: { "@id": `${absUrl("/")}#org` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${absUrl("/")}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const jsonLdOrg = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${absUrl("/")}#org`,
  name: site.name,
  url: absUrl("/"),
  logo: absUrl("/logo.png"),
  sameAs: [site.github],
  founder: { "@type": "Person", name: site.author },
  disambiguatingDescription:
    "An educational site for LeetCode problem solving, data structures, algorithms, and coding interview preparation — with animated visual walkthroughs.",
  knowsAbout: [
    "LeetCode",
    "Coding interviews",
    "Software engineering interviews",
    "Data structures",
    "Algorithms",
    "Problem solving",
    "Python",
    "Go",
    "Algorithm visualization",
  ],
});

export const jsonLdApp = () => {
  const stats = catalogStats();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "EducationalApplication",
    applicationSubCategory: "Coding interview preparation",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "software engineer",
    },
    about: ["LeetCode", "Coding interviews", "Data structures", "Algorithms", "Problem solving"],
    keywords: site.keywords.join(", "),
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: absUrl("/"),
    description: site.description,
    featureList: [
      `Complete LeetCode catalogue (${stats.total} problems)`,
      `${stats.animated} free animated walkthroughs`,
      `${stats.locked} locked Premium problems listed only`,
      "Well-explained Python and Go solutions",
      "Interactive step-through player",
      "Coding interview and DSA practice",
    ],
    inLanguage: site.localeBcp47,
    author: { "@type": "Person", name: site.author },
    publisher: { "@id": `${absUrl("/")}#org` },
  };
};

export const jsonLdFaq = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

export const jsonLdBreadcrumb = (crumbs: readonly { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absUrl(c.path),
  })),
});

export const jsonLdItemList = (
  name: string,
  url: string,
  items: readonly { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  url,
  numberOfItems: items.length,
  itemListElement: items.slice(0, 50).map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    url: absUrl(item.path),
  })),
});

export const jsonLdProblem = (problem: Problem) => {
  const url = absUrl(`/problems/${problem.slug}`);
  const headline = `${problem.id}. ${problem.title}`;
  const primary = problem.approaches.find((a) => a.kind === "optimal") ?? problem.approaches[0];
  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline,
      name: problemTitle(problem.id, problem.title),
      description: problem.blurb,
      url,
      mainEntityOfPage: url,
      inLanguage: site.localeBcp47,
      isAccessibleForFree: true,
      datePublished: SITE_UPDATED,
      dateModified: SITE_UPDATED,
      author: { "@type": "Person", name: site.author },
      publisher: { "@id": `${absUrl("/")}#org` },
      image: absUrl("/logo.png"),
      proficiencyLevel: problem.difficulty,
      keywords: [
        problem.title,
        "leetcode",
        "coding interview",
        "algorithm visualization",
        "animated solution",
        ...problem.topics,
      ].join(", "),
      about: {
        "@type": "Thing",
        name: `LeetCode ${problem.id}. ${problem.title}`,
        url: leetcodeUrl(problem.slug),
      },
      programmingLanguage: ["Python", "Go"],
    },
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: headline,
      url,
      description: problem.blurb,
      learningResourceType: "interactive tutorial",
      educationalLevel: problem.difficulty,
      educationalUse: "self-study",
      teaches: problem.topics,
      inLanguage: site.localeBcp47,
      isAccessibleForFree: true,
      interactivityType: "active",
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `Watch the animated solution for ${problem.title}`,
      description: `Read the problem, study the explained Python and Go solution, then scrub the visual walkthrough for ${problem.title}.`,
      totalTime: "PT15M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Read the problem and examples",
          text: `Understand ${problem.title} from the written statement and worked input/output examples.`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Study the explained solution",
          text: `${primary?.title ?? "The solution"} is written in Python and Go with complexity notes.`,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Scrub the algorithm animation",
          text: "Press Run, then step the player to watch arrays, maps, and pointers move as the code executes.",
        },
      ],
    },
    jsonLdBreadcrumb([
      { name: "Problems", path: "/" },
      { name: problem.difficulty, path: `/explore/${topicSlug(problem.difficulty)}` },
      { name: headline, path: `/problems/${problem.slug}` },
    ]),
  ];
};
