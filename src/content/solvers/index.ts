import {
  addTwoNumbers,
  linkedListCycle,
  mergeTwoSortedLists,
  middleOfTheLinkedList,
} from "./impl/list";
import {
  containsDuplicate,
  firstUniqueCharacter,
  groupAnagrams,
  happyNumber,
  singleNumber,
  validAnagram,
} from "./impl/hash";
import {
  majorityElement,
  mergeSortedArray,
  missingNumber,
  moveZeroes,
  plusOne,
  productExceptSelf,
  removeDuplicates,
} from "./impl/array";
import {
  addBinary,
  lengthOfLastWord,
  longestCommonPrefix,
  palindromeNumber,
  reverseString,
  romanToInteger,
  validPalindrome,
} from "./impl/string";
import { searchInsertPosition, twoSumSorted } from "./impl/search";
import { coinChange, fibonacciNumber, houseRobber } from "./impl/dp";
import type { Solver } from "./types";

export type { Solver } from "./types";
export { materialize } from "./materialize";
export { SOLVED_SLUGS, SOLVER_SLUGS } from "./pick";

export const SOLVERS: readonly Solver[] = [
  addTwoNumbers,
  mergeTwoSortedLists,
  linkedListCycle,
  middleOfTheLinkedList,
  containsDuplicate,
  validAnagram,
  groupAnagrams,
  singleNumber,
  happyNumber,
  firstUniqueCharacter,
  plusOne,
  removeDuplicates,
  moveZeroes,
  productExceptSelf,
  majorityElement,
  missingNumber,
  mergeSortedArray,
  validPalindrome,
  palindromeNumber,
  romanToInteger,
  longestCommonPrefix,
  reverseString,
  lengthOfLastWord,
  addBinary,
  searchInsertPosition,
  twoSumSorted,
  houseRobber,
  coinChange,
  fibonacciNumber,
];

const bySlug = new Map<string, Solver>();
for (const solver of SOLVERS) {
  for (const slug of solver.slugs) {
    if (bySlug.has(slug)) {
      throw new Error(`solver slug collision: ${slug}`);
    }
    bySlug.set(slug, solver);
  }
}

export const solverOf = (slug: string): Solver | undefined => bySlug.get(slug);
