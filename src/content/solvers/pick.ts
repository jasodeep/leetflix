/**
 * Slugs that have a real solver (not a family-pattern stand-in).
 * Keep this list in sync with `SOLVERS` — `tests/solvers.test.ts` checks it.
 */
export const SOLVER_SLUGS = [
  "add-two-numbers",
  "merge-two-sorted-lists",
  "linked-list-cycle",
  "middle-of-the-linked-list",
  "contains-duplicate",
  "valid-anagram",
  "group-anagrams",
  "single-number",
  "happy-number",
  "first-unique-character-in-a-string",
  "plus-one",
  "remove-duplicates-from-sorted-array",
  "move-zeroes",
  "product-of-array-except-self",
  "majority-element",
  "missing-number",
  "merge-sorted-array",
  "valid-palindrome",
  "palindrome-number",
  "roman-to-integer",
  "longest-common-prefix",
  "reverse-string",
  "length-of-last-word",
  "add-binary",
  "search-insert-position",
  "two-sum-ii-input-array-is-sorted",
  "house-robber",
  "coin-change",
  "fibonacci-number",
] as const;

export const SOLVED_SLUGS: ReadonlySet<string> = new Set(SOLVER_SLUGS);
