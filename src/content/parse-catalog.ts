import { CatalogError } from "@/lib/errors";
import { DIFFICULTIES, isTopic, type CatalogEntry, type Difficulty, type Topic } from "@/lib/types";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIFFICULTY_SET = new Set<string>(DIFFICULTIES);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseEntry = (value: unknown, index: number): CatalogEntry => {
  if (!isRecord(value)) {
    throw new CatalogError(`leetcode.json[${index}] must be an object`);
  }

  const id = value.id;
  if (typeof id !== "number" || !Number.isInteger(id) || id < 1) {
    throw new CatalogError(`leetcode.json[${index}].id must be a positive integer`);
  }

  const slug = value.slug;
  if (typeof slug !== "string" || !SLUG.test(slug)) {
    throw new CatalogError(`leetcode.json[${index}].slug is not a LeetCode slug`);
  }

  const title = value.title;
  if (typeof title !== "string" || title.trim() === "") {
    throw new CatalogError(`leetcode.json[${index}].title must be a non-empty string`);
  }

  const difficulty = value.difficulty;
  if (typeof difficulty !== "string" || !DIFFICULTY_SET.has(difficulty)) {
    throw new CatalogError(`leetcode.json[${index}].difficulty must be Easy, Medium, or Hard`);
  }

  const topics = value.topics;
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new CatalogError(`leetcode.json[${index}].topics must be a non-empty array`);
  }
  const parsedTopics: Topic[] = [];
  for (const topic of topics) {
    if (typeof topic !== "string" || !isTopic(topic)) {
      throw new CatalogError(
        `leetcode.json[${index}].topics contains unknown tag ${String(topic)}`,
      );
    }
    parsedTopics.push(topic);
  }

  const entry: CatalogEntry = {
    id,
    slug,
    title,
    difficulty: difficulty as Difficulty,
    topics: parsedTopics,
  };

  if (value.premium === true) entry.premium = true;
  else if (value.premium !== undefined && value.premium !== false) {
    throw new CatalogError(`leetcode.json[${index}].premium must be a boolean`);
  }

  return entry;
};

/** Fail the build if the synced dump is the wrong shape. */
export const parseCatalog = (raw: unknown): CatalogEntry[] => {
  if (!Array.isArray(raw)) {
    throw new CatalogError("leetcode.json must be an array");
  }

  const entries: CatalogEntry[] = [];
  const ids = new Set<number>();
  const slugs = new Set<string>();

  for (let i = 0; i < raw.length; i++) {
    const entry = parseEntry(raw[i], i);
    if (ids.has(entry.id)) throw new CatalogError(`duplicate catalog id ${entry.id}`);
    if (slugs.has(entry.slug)) throw new CatalogError(`duplicate catalog slug ${entry.slug}`);
    ids.add(entry.id);
    slugs.add(entry.slug);
    entries.push(entry);
  }

  return entries;
};
