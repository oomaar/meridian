import type { FileTab } from "../types/FileTab";

export const TAB_SETS: FileTab[][] = [
  [
    {
      name: "main.py",
      content: `def process(data, threshold=0.5):
    results = []
    for item in data:
        score = item.get("score", 0)
        if score >= threshold:
            results.append(item)
    return sorted(results, key=lambda x: x["score"], reverse=True)`,
    },
    {
      name: "utils.py",
      content: `def clamp(value, lo, hi):
    return max(lo, min(hi, value))

def normalize(seq):
    total = sum(seq)
    if total == 0:
        return [0.0] * len(seq)
    return [x / total for x in seq]`,
    },
    {
      name: "tests/test_main.py",
      content: `import pytest
from main import process

def test_empty():
    assert process([]) == []

def test_threshold():
    data = [{"score": 0.3}, {"score": 0.7}, {"score": 0.5}]
    result = process(data, threshold=0.5)
    assert all(r["score"] >= 0.5 for r in result)

def test_sorted_desc():
    data = [{"score": 0.6}, {"score": 0.9}, {"score": 0.75}]
    result = process(data)
    assert result[0]["score"] == 0.9`,
    },
    {
      name: "README.md",
      content: `# Submission Notes

## Approach
Used a linear scan with early filtering before sorting to avoid unnecessary comparisons on large datasets.

## Known Issues
- Edge case with NaN scores is not handled
- threshold default could be configurable via env

## Tests
Run with \`pytest tests/\``,
    },
  ],
  [
    {
      name: "solution.js",
      content: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(a, b) {
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    result.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  return result.concat(a.slice(i)).concat(b.slice(j));
}`,
    },
    {
      name: "helpers.js",
      content: `const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

const isSorted = (arr) =>
  arr.every((v, i) => i === 0 || arr[i - 1] <= v);

module.exports = { swap, isSorted };`,
    },
    {
      name: "tests/sort.test.js",
      content: `const { mergeSort } = require("./solution");

test("empty array", () => {
  expect(mergeSort([])).toEqual([]);
});

test("single element", () => {
  expect(mergeSort([1])).toEqual([1]);
});

test("already sorted", () => {
  expect(mergeSort([1, 2, 3])).toEqual([1, 2, 3]);
});

test("reverse sorted", () => {
  expect(mergeSort([3, 2, 1])).toEqual([1, 2, 3]);
});`,
    },
    {
      name: "README.md",
      content: `# Merge Sort Implementation

## Complexity
- Time: O(n log n) — all cases
- Space: O(n) auxiliary

## Notes
Chose iterative merge over recursive to avoid stack overflow on large inputs.
All edge cases (empty, single, duplicate values) covered in tests.`,
    },
  ],
  [
    {
      name: "BinaryTree.java",
      content: `public class BinaryTree<T extends Comparable<T>> {
    private Node<T> root;

    public void insert(T value) {
        root = insertRec(root, value);
    }

    private Node<T> insertRec(Node<T> node, T value) {
        if (node == null) return new Node<>(value);
        if (value.compareTo(node.data) < 0)
            node.left = insertRec(node.left, value);
        else
            node.right = insertRec(node.right, value);
        return node;
    }
}`,
    },
    {
      name: "Node.java",
      content: `public class Node<T> {
    T data;
    Node<T> left, right;

    Node(T data) {
        this.data = data;
    }
}`,
    },
    {
      name: "tests/BinaryTreeTest.java",
      content: `@Test
public void testInsert() {
    BinaryTree<Integer> tree = new BinaryTree<>();
    tree.insert(5);
    tree.insert(3);
    tree.insert(7);
    assertTrue(tree.contains(5));
    assertTrue(tree.contains(3));
    assertFalse(tree.contains(10));
}

@Test
public void testEmpty() {
    BinaryTree<Integer> tree = new BinaryTree<>();
    assertFalse(tree.contains(1));
}`,
    },
    {
      name: "README.md",
      content: `# Binary Search Tree

Generic BST implementation supporting insert, search, and in-order traversal.

## Usage
\`\`\`java
BinaryTree<Integer> tree = new BinaryTree<>();
tree.insert(10);
tree.contains(10); // true
\`\`\``,
    },
  ],
];
