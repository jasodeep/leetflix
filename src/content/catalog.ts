import type { CatalogEntry, Difficulty, Topic } from "@/lib/types";
import { slugify } from "@/lib/utils";

type Row = [id: number, title: string, difficulty: Difficulty, topics: Topic[], premium?: true];

/**
 * The browsable catalogue. Ordered roughly by the NeetCode 150 study path,
 * which is a superset of the Blind 75. Slugs match LeetCode's own so links
 * out to leetcode.com/problems/<slug> work.
 *
 * Problems with a full Leetflix deep-dive live in `content/problems/`. Rows
 * here without one render as "coming soon".
 */
const rows: Row[] = [
  // Arrays & Hashing
  [217, "Contains Duplicate", "Easy", ["Array", "Hash Table"]],
  [242, "Valid Anagram", "Easy", ["Hash Table", "String"]],
  [1, "Two Sum", "Easy", ["Array", "Hash Table"]],
  [49, "Group Anagrams", "Medium", ["Array", "Hash Table", "String"]],
  [347, "Top K Frequent Elements", "Medium", ["Array", "Hash Table", "Heap"]],
  [271, "Encode and Decode Strings", "Medium", ["String", "Design"], true],
  [238, "Product of Array Except Self", "Medium", ["Array", "Prefix Sum"]],
  [36, "Valid Sudoku", "Medium", ["Array", "Hash Table", "Matrix"]],
  [128, "Longest Consecutive Sequence", "Medium", ["Array", "Hash Table", "Union Find"]],

  // Two Pointers
  [125, "Valid Palindrome", "Easy", ["Two Pointers", "String"]],
  [167, "Two Sum II - Input Array Is Sorted", "Medium", ["Array", "Two Pointers", "Binary Search"]],
  [15, "3Sum", "Medium", ["Array", "Two Pointers", "Sorting"]],
  [11, "Container With Most Water", "Medium", ["Array", "Two Pointers", "Greedy"]],
  [42, "Trapping Rain Water", "Hard", ["Array", "Two Pointers", "Monotonic Stack"]],

  // Sliding Window
  [121, "Best Time to Buy and Sell Stock", "Easy", ["Array", "Dynamic Programming"]],
  [
    3,
    "Longest Substring Without Repeating Characters",
    "Medium",
    ["Hash Table", "String", "Sliding Window"],
  ],
  [
    424,
    "Longest Repeating Character Replacement",
    "Medium",
    ["Hash Table", "String", "Sliding Window"],
  ],
  [567, "Permutation in String", "Medium", ["Hash Table", "Two Pointers", "Sliding Window"]],
  [76, "Minimum Window Substring", "Hard", ["Hash Table", "String", "Sliding Window"]],
  [239, "Sliding Window Maximum", "Hard", ["Array", "Sliding Window", "Monotonic Stack", "Heap"]],

  // Stack
  [20, "Valid Parentheses", "Easy", ["String", "Stack"]],
  [155, "Min Stack", "Medium", ["Stack", "Design"]],
  [150, "Evaluate Reverse Polish Notation", "Medium", ["Array", "Math", "Stack"]],
  [22, "Generate Parentheses", "Medium", ["String", "Backtracking"]],
  [739, "Daily Temperatures", "Medium", ["Array", "Stack", "Monotonic Stack"]],
  [853, "Car Fleet", "Medium", ["Array", "Stack", "Sorting", "Monotonic Stack"]],
  [84, "Largest Rectangle in Histogram", "Hard", ["Array", "Stack", "Monotonic Stack"]],

  // Binary Search
  [704, "Binary Search", "Easy", ["Array", "Binary Search"]],
  [74, "Search a 2D Matrix", "Medium", ["Array", "Binary Search", "Matrix"]],
  [875, "Koko Eating Bananas", "Medium", ["Array", "Binary Search"]],
  [153, "Find Minimum in Rotated Sorted Array", "Medium", ["Array", "Binary Search"]],
  [33, "Search in Rotated Sorted Array", "Medium", ["Array", "Binary Search"]],
  [981, "Time Based Key-Value Store", "Medium", ["Hash Table", "Binary Search", "Design"]],
  [4, "Median of Two Sorted Arrays", "Hard", ["Array", "Binary Search", "Divide and Conquer"]],

  // Linked List
  [206, "Reverse Linked List", "Easy", ["Linked List", "Recursion"]],
  [21, "Merge Two Sorted Lists", "Easy", ["Linked List", "Recursion"]],
  [143, "Reorder List", "Medium", ["Linked List", "Two Pointers", "Stack", "Recursion"]],
  [19, "Remove Nth Node From End of List", "Medium", ["Linked List", "Two Pointers"]],
  [138, "Copy List with Random Pointer", "Medium", ["Hash Table", "Linked List"]],
  [2, "Add Two Numbers", "Medium", ["Linked List", "Math", "Recursion"]],
  [141, "Linked List Cycle", "Easy", ["Hash Table", "Linked List", "Two Pointers"]],
  [
    287,
    "Find the Duplicate Number",
    "Medium",
    ["Array", "Two Pointers", "Binary Search", "Bit Manipulation"],
  ],
  [146, "LRU Cache", "Medium", ["Hash Table", "Linked List", "Design"]],
  [23, "Merge k Sorted Lists", "Hard", ["Linked List", "Divide and Conquer", "Heap"]],
  [25, "Reverse Nodes in k-Group", "Hard", ["Linked List", "Recursion"]],

  // Trees
  [226, "Invert Binary Tree", "Easy", ["Tree", "DFS", "BFS"]],
  [104, "Maximum Depth of Binary Tree", "Easy", ["Tree", "DFS", "BFS"]],
  [543, "Diameter of Binary Tree", "Easy", ["Tree", "DFS"]],
  [110, "Balanced Binary Tree", "Easy", ["Tree", "DFS"]],
  [100, "Same Tree", "Easy", ["Tree", "DFS", "BFS"]],
  [572, "Subtree of Another Tree", "Easy", ["Tree", "DFS"]],
  [
    235,
    "Lowest Common Ancestor of a Binary Search Tree",
    "Medium",
    ["Tree", "Binary Search Tree", "DFS"],
  ],
  [102, "Binary Tree Level Order Traversal", "Medium", ["Tree", "BFS"]],
  [199, "Binary Tree Right Side View", "Medium", ["Tree", "DFS", "BFS"]],
  [1448, "Count Good Nodes in Binary Tree", "Medium", ["Tree", "DFS", "BFS"]],
  [98, "Validate Binary Search Tree", "Medium", ["Tree", "Binary Search Tree", "DFS"]],
  [230, "Kth Smallest Element in a BST", "Medium", ["Tree", "Binary Search Tree", "DFS"]],
  [
    105,
    "Construct Binary Tree from Preorder and Inorder Traversal",
    "Medium",
    ["Array", "Hash Table", "Tree", "Divide and Conquer"],
  ],
  [124, "Binary Tree Maximum Path Sum", "Hard", ["Tree", "DFS", "Dynamic Programming"]],
  [
    297,
    "Serialize and Deserialize Binary Tree",
    "Hard",
    ["String", "Tree", "DFS", "BFS", "Design"],
  ],

  // Tries
  [208, "Implement Trie (Prefix Tree)", "Medium", ["Hash Table", "String", "Trie", "Design"]],
  [
    211,
    "Design Add and Search Words Data Structure",
    "Medium",
    ["String", "Trie", "DFS", "Design"],
  ],
  [212, "Word Search II", "Hard", ["Array", "String", "Backtracking", "Trie", "Matrix"]],

  // Heap / Priority Queue
  [703, "Kth Largest Element in a Stream", "Easy", ["Tree", "Heap", "Design"]],
  [1046, "Last Stone Weight", "Easy", ["Array", "Heap"]],
  [
    973,
    "K Closest Points to Origin",
    "Medium",
    ["Array", "Math", "Heap", "Sorting", "Divide and Conquer"],
  ],
  [
    215,
    "Kth Largest Element in an Array",
    "Medium",
    ["Array", "Heap", "Sorting", "Divide and Conquer"],
  ],
  [621, "Task Scheduler", "Medium", ["Array", "Hash Table", "Greedy", "Heap"]],
  [355, "Design Twitter", "Medium", ["Hash Table", "Linked List", "Heap", "Design"]],
  [295, "Find Median from Data Stream", "Hard", ["Two Pointers", "Heap", "Design", "Sorting"]],

  // Backtracking
  [78, "Subsets", "Medium", ["Array", "Backtracking", "Bit Manipulation"]],
  [39, "Combination Sum", "Medium", ["Array", "Backtracking"]],
  [46, "Permutations", "Medium", ["Array", "Backtracking"]],
  [90, "Subsets II", "Medium", ["Array", "Backtracking", "Bit Manipulation"]],
  [40, "Combination Sum II", "Medium", ["Array", "Backtracking"]],
  [79, "Word Search", "Medium", ["Array", "String", "Backtracking", "Matrix"]],
  [131, "Palindrome Partitioning", "Medium", ["String", "Backtracking", "Dynamic Programming"]],
  [17, "Letter Combinations of a Phone Number", "Medium", ["Hash Table", "String", "Backtracking"]],
  [51, "N-Queens", "Hard", ["Array", "Backtracking"]],

  // Graphs
  [200, "Number of Islands", "Medium", ["Array", "DFS", "BFS", "Union Find", "Matrix"]],
  [695, "Max Area of Island", "Medium", ["Array", "DFS", "BFS", "Union Find", "Matrix"]],
  [133, "Clone Graph", "Medium", ["Hash Table", "DFS", "BFS", "Graph"]],
  [286, "Walls and Gates", "Medium", ["Array", "BFS", "Matrix"], true],
  [994, "Rotting Oranges", "Medium", ["Array", "BFS", "Matrix"]],
  [417, "Pacific Atlantic Water Flow", "Medium", ["Array", "DFS", "BFS", "Matrix"]],
  [130, "Surrounded Regions", "Medium", ["Array", "DFS", "BFS", "Union Find", "Matrix"]],
  [207, "Course Schedule", "Medium", ["DFS", "BFS", "Graph", "Topological Sort"]],
  [210, "Course Schedule II", "Medium", ["DFS", "BFS", "Graph", "Topological Sort"]],
  [684, "Redundant Connection", "Medium", ["DFS", "BFS", "Union Find", "Graph"]],
  [
    323,
    "Number of Connected Components in an Undirected Graph",
    "Medium",
    ["DFS", "BFS", "Union Find", "Graph"],
    true,
  ],
  [261, "Graph Valid Tree", "Medium", ["DFS", "BFS", "Union Find", "Graph"], true],
  [127, "Word Ladder", "Hard", ["Hash Table", "String", "BFS"]],

  // Advanced Graphs
  [332, "Reconstruct Itinerary", "Hard", ["DFS", "Graph"]],
  [1584, "Min Cost to Connect All Points", "Medium", ["Array", "Union Find", "Graph"]],
  [743, "Network Delay Time", "Medium", ["DFS", "BFS", "Graph", "Heap", "Shortest Path"]],
  [
    778,
    "Swim in Rising Water",
    "Hard",
    ["Array", "Binary Search", "DFS", "BFS", "Union Find", "Heap", "Matrix"],
  ],
  [
    269,
    "Alien Dictionary",
    "Hard",
    ["Array", "String", "DFS", "BFS", "Graph", "Topological Sort"],
    true,
  ],
  [
    787,
    "Cheapest Flights Within K Stops",
    "Medium",
    ["Dynamic Programming", "DFS", "BFS", "Graph", "Heap", "Shortest Path"],
  ],

  // 1-D Dynamic Programming
  [70, "Climbing Stairs", "Easy", ["Math", "Dynamic Programming", "Recursion"]],
  [746, "Min Cost Climbing Stairs", "Easy", ["Array", "Dynamic Programming"]],
  [198, "House Robber", "Medium", ["Array", "Dynamic Programming"]],
  [213, "House Robber II", "Medium", ["Array", "Dynamic Programming"]],
  [5, "Longest Palindromic Substring", "Medium", ["Two Pointers", "String", "Dynamic Programming"]],
  [647, "Palindromic Substrings", "Medium", ["Two Pointers", "String", "Dynamic Programming"]],
  [91, "Decode Ways", "Medium", ["String", "Dynamic Programming"]],
  [322, "Coin Change", "Medium", ["Array", "Dynamic Programming", "BFS"]],
  [152, "Maximum Product Subarray", "Medium", ["Array", "Dynamic Programming"]],
  [139, "Word Break", "Medium", ["Array", "Hash Table", "String", "Dynamic Programming", "Trie"]],
  [
    300,
    "Longest Increasing Subsequence",
    "Medium",
    ["Array", "Binary Search", "Dynamic Programming"],
  ],
  [416, "Partition Equal Subset Sum", "Medium", ["Array", "Dynamic Programming"]],

  // 2-D Dynamic Programming
  [62, "Unique Paths", "Medium", ["Math", "Dynamic Programming"]],
  [1143, "Longest Common Subsequence", "Medium", ["String", "Dynamic Programming"]],
  [
    309,
    "Best Time to Buy and Sell Stock with Cooldown",
    "Medium",
    ["Array", "Dynamic Programming"],
  ],
  [518, "Coin Change II", "Medium", ["Array", "Dynamic Programming"]],
  [494, "Target Sum", "Medium", ["Array", "Dynamic Programming", "Backtracking"]],
  [97, "Interleaving String", "Medium", ["String", "Dynamic Programming"]],
  [
    329,
    "Longest Increasing Path in a Matrix",
    "Hard",
    ["Array", "Dynamic Programming", "DFS", "BFS", "Matrix"],
  ],
  [115, "Distinct Subsequences", "Hard", ["String", "Dynamic Programming"]],
  [72, "Edit Distance", "Medium", ["String", "Dynamic Programming"]],
  [312, "Burst Balloons", "Hard", ["Array", "Dynamic Programming"]],
  [10, "Regular Expression Matching", "Hard", ["String", "Dynamic Programming", "Recursion"]],

  // Greedy
  [53, "Maximum Subarray", "Medium", ["Array", "Divide and Conquer", "Dynamic Programming"]],
  [55, "Jump Game", "Medium", ["Array", "Dynamic Programming", "Greedy"]],
  [45, "Jump Game II", "Medium", ["Array", "Dynamic Programming", "Greedy"]],
  [134, "Gas Station", "Medium", ["Array", "Greedy"]],
  [846, "Hand of Straights", "Medium", ["Array", "Hash Table", "Greedy", "Sorting"]],
  [1899, "Merge Triplets to Form Target Triplet", "Medium", ["Array", "Greedy"]],
  [763, "Partition Labels", "Medium", ["Hash Table", "Two Pointers", "String", "Greedy"]],
  [678, "Valid Parenthesis String", "Medium", ["String", "Dynamic Programming", "Stack", "Greedy"]],

  // Intervals
  [57, "Insert Interval", "Medium", ["Array", "Intervals"]],
  [56, "Merge Intervals", "Medium", ["Array", "Sorting", "Intervals"]],
  [
    435,
    "Non-overlapping Intervals",
    "Medium",
    ["Array", "Dynamic Programming", "Greedy", "Sorting", "Intervals"],
  ],
  [252, "Meeting Rooms", "Easy", ["Array", "Sorting", "Intervals"], true],
  [
    253,
    "Meeting Rooms II",
    "Medium",
    ["Array", "Two Pointers", "Greedy", "Sorting", "Heap", "Intervals"],
    true,
  ],
  [
    1851,
    "Minimum Interval to Include Each Query",
    "Hard",
    ["Array", "Binary Search", "Sorting", "Heap", "Intervals"],
  ],

  // Math & Geometry
  [48, "Rotate Image", "Medium", ["Array", "Math", "Matrix"]],
  [54, "Spiral Matrix", "Medium", ["Array", "Matrix"]],
  [73, "Set Matrix Zeroes", "Medium", ["Array", "Hash Table", "Matrix"]],
  [202, "Happy Number", "Easy", ["Hash Table", "Math", "Two Pointers"]],
  [66, "Plus One", "Easy", ["Array", "Math"]],
  [50, "Pow(x, n)", "Medium", ["Math", "Recursion"]],
  [43, "Multiply Strings", "Medium", ["Math", "String"]],
  [2013, "Detect Squares", "Medium", ["Array", "Hash Table", "Design"]],

  // Bit Manipulation
  [136, "Single Number", "Easy", ["Array", "Bit Manipulation"]],
  [191, "Number of 1 Bits", "Easy", ["Bit Manipulation"]],
  [338, "Counting Bits", "Easy", ["Dynamic Programming", "Bit Manipulation"]],
  [190, "Reverse Bits", "Easy", ["Bit Manipulation", "Divide and Conquer"]],
  [268, "Missing Number", "Easy", ["Array", "Hash Table", "Math", "Bit Manipulation", "Sorting"]],
  [371, "Sum of Two Integers", "Medium", ["Math", "Bit Manipulation"]],
  [7, "Reverse Integer", "Medium", ["Math"]],
];

/** LeetCode slugs that don't follow the plain `slugify(title)` rule. */
const slugOverrides: Record<number, string> = {
  50: "powx-n",
  208: "implement-trie-prefix-tree",
};

export const catalog: CatalogEntry[] = rows.map(([id, title, difficulty, topics, premium]) => ({
  id,
  title,
  difficulty,
  topics,
  slug: slugOverrides[id] ?? slugify(title),
  ...(premium ? { premium: true } : {}),
}));
