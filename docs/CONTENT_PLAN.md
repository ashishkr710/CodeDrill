# CodeDrill — Content Architecture, Taxonomy & Curriculum Plan

**Version:** 1.0.0  
**Status:** Approved for Review (Phase 0)  
**Author:** Full-Stack TypeScript Architect & Java Lead  

---

## 1. Full Topic Taxonomy

### Track 1: Java Collections Mastery (`java-collections`)
Covers architecture, internals, contracts, and multithreading behavior of `java.util` and `java.util.concurrent`.

| Module Slug | Topic Title | Target Questions | Key Concepts Covered |
| :--- | :--- | :---: | :--- |
| `lists-fundamentals` | List Implementations (ArrayList vs LinkedList) | 20 | Dynamic resizing formula (`n + (n >> 1)`), memory layout, random access O(1) vs node traversal O(N), memory locality. |
| `sets-and-uniqueness` | Set Hierarchy (HashSet, LinkedHashSet, TreeSet) | 15 | Backing maps (`HashMap`, `LinkedHashMap`, `TreeMap`), duplicate suppression, sorting invariants (`Comparable` / `Comparator`). |
| `maps-and-hashmap-internals`| Map Hierarchy & HashMap Deep-Dive | 30 | Hash function distribution, bucketing, initial capacity (16), load factor (0.75), treeification (`TREEIFY_THRESHOLD = 8`, `UNTREEIFY_THRESHOLD = 6`, `MIN_TREEIFY_CAPACITY = 64`), collision resolution. |
| `linked-hashmap-treemap` | LinkedHashMap & TreeMap Mechanics | 15 | Access-order vs insertion-order (LRU caches), Red-Black self-balancing tree invariants, `NavigableMap`, range queries (`subMap`, `headMap`, `tailMap`). |
| `queues-and-deques` | Queue, Deque & PriorityQueue | 15 | FIFO vs LIFO, binary min-heap internals, capacity growth, `ArrayDeque` circular array vs `LinkedList`, `null` prohibition. |
| `iterators-and-concurrency` | Iterators & Fail-Fast vs Fail-Safe | 20 | `Iterator` vs `ListIterator`, `modCount` state tracking, `ConcurrentModificationException`, weakly consistent iterators. |
| `concurrent-collections` | Thread-Safe Collections | 25 | `ConcurrentHashMap` (CAS + synchronized buckets, transfer step during resizing), `CopyOnWriteArrayList` (snapshot array clone cost), blocking queues (`ArrayBlockingQueue`, `LinkedBlockingQueue`). |
| `utilities-and-contracts` | Collections / Arrays Utilities & Object Contracts | 20 | `Collections.unmodifiableList()`, `Arrays.asList()` vs `List.of()` mutability semantics, `equals()` and `hashCode()` contract rules, symmetry, transitivity, consistency. |

---

### Track 2: Data Structures & Algorithms (`dsa`)
Covers LeetCode-style algorithm patterns across core computer science categories.

| Module Slug | Topic Title | Target Questions | Core Patterns Covered |
| :--- | :--- | :---: | :--- |
| `arrays-and-strings` | Arrays & String Manipulation | 25 | In-place modifications, prefix sums, kadane's algorithm, palindromes, anagrams. |
| `hashing-and-two-pointers`| Hashing & Two Pointers | 25 | Pair sum, three sum, opposite-direction pointers, fast & slow pointers (cycle detection). |
| `sliding-window` | Fixed & Dynamic Sliding Window | 20 | Longest substring without repeating characters, minimum size subarray sum, frequency counting. |
| `stacks-and-queues` | Stacks, Monotonic Stacks & Queues | 20 | Balanced parentheses, next greater element, sliding window maximum, min stack. |
| `linked-lists` | Singly & Doubly Linked Lists | 20 | List reversal, cycle detection, merge sorted lists, LRU cache implementation. |
| `trees-and-bst` | Binary Trees & Binary Search Trees | 30 | Traversals (Inorder, Preorder, Postorder, Level-order), Lowest Common Ancestor (LCA), tree height, validate BST. |
| `heaps-and-priority-queues`| Heaps & K-Way Problems | 15 | Top-K elements, find median from data stream, merge K sorted lists. |
| `graphs-traversal-topo` | Graph Traversals & Topological Sort | 25 | BFS, DFS, cycle detection (directed & undirected), Kahn's algorithm, bipartite check. |
| `recursion-backtracking` | Recursion & Backtracking | 20 | Permutations, combinations, subsets, N-Queens, word search. |
| `dynamic-programming` | 1D & 2D Dynamic Programming | 35 | Climbing stairs, house robber, 0/1 knapsack, longest common subsequence, edit distance. |
| `greedy-algorithms` | Greedy Algorithms & Intervals | 15 | Interval scheduling, jump game, gas station. |
| `binary-search-and-sorting`| Binary Search & Efficient Sorting | 20 | Rotated sorted array, search in 2D matrix, quicksort, mergesort. |
| `tries-and-bits` | Tries & Bit Manipulation | 15 | Prefix tree implementation, single number, power of two, bit counting. |

---

## 2. Difficulty Rubric

| Difficulty | Cognitive Requirement | Target Solve Time | Acceptance Rate Benchmark |
| :--- | :--- | :--- | :--- |
| **Easy** | Direct recall of syntax, standard library methods, or single-pass linear scans. | 3–8 minutes | 70% – 90% |
| **Medium** | Combining two data structures, multi-step logic (e.g., custom hash key with `equals`/`hashCode`, tree recursion). | 10–20 minutes | 45% – 70% |
| **Hard** | Subtle concurrency edge cases, multi-state dynamic programming, complex tree balancing, or micro-optimizations. | 25–45 minutes | 15% – 45% |

---

## 3. Concrete Sample Questions (5 per Type)

### 3.1 Modality 1: Multiple Choice Questions (MCQ)

#### Sample 1 (Java Collections - Easy)
- **Title:** `List.of()` vs `Arrays.asList()` Mutability
- **Prompt:** What happens when you attempt to invoke `.set(0, "X")` on a list created via `List.of("A", "B")`?
- **Options:**
  - A: The first element is replaced with `"X"`.
  - B: Throws `UnsupportedOperationException` at runtime.
  - C: Throws `IllegalArgumentException` at runtime.
  - D: Compilation fails because `set()` does not exist on `List`.
- **Correct:** B
- **Explanation:** `List.of()` returns an unmodifiable list instance (Java 9+). Any mutating method (`add`, `set`, `remove`) throws `UnsupportedOperationException`. In contrast, `Arrays.asList()` returns a fixed-size list that permits `set()`, but forbids `add()` and `remove()`.

#### Sample 2 (Java Collections - Medium)
- **Title:** `TreeSet` Ordering with Null Elements
- **Prompt:** What is the result of attempting to insert a `null` value into a `new TreeSet<String>()` in Java 8+?
- **Options:**
  - A: It is stored at the root of the tree.
  - B: It is placed as the first element before all non-null strings.
  - C: Throws `NullPointerException` immediately.
  - D: The insertion returns `false` and is quietly ignored.
- **Correct:** C
- **Explanation:** `TreeSet` relies on natural ordering (`Comparable`) or a custom `Comparator` to position elements. Comparing `null` to any object via `compareTo()` would throw `NullPointerException`. Therefore, `TreeSet` forbids null elements entirely since Java 7.

#### Sample 3 (Java Collections - Hard)
- **Title:** `HashMap` Treeification Preconditions
- **Prompt:** A `HashMap` has reached 9 entries in a single bucket. Under what condition will this bucket actually convert into a Red-Black Tree (`TreeNode`)?
- **Options:**
  - A: Immediately, whenever any single bucket count exceeds 8.
  - B: Only if the bucket count exceeds 8 AND the total map capacity is at least 64 (`MIN_TREEIFY_CAPACITY`).
  - C: Only if the load factor exceeds 0.90.
  - D: Only when garbage collection runs a compaction phase.
- **Correct:** B
- **Explanation:** In Java 8+, even if a single bucket chain hits `TREEIFY_THRESHOLD = 8`, treeification will NOT occur if the total table capacity is less than 64 (`MIN_TREEIFY_CAPACITY`). Instead, the map will invoke `resize()` to double capacity and redistribute keys across buckets.

#### Sample 4 (DSA - Medium)
- **Title:** Monotonic Stack Complexity for Next Greater Element
- **Prompt:** What is the amortized time complexity of finding the Next Greater Element for all elements in an array of size $N$ using a monotonic stack?
- **Options:**
  - A: $O(N \log N)$
  - B: $O(N^2)$
  - C: $O(N)$
  - D: $O(\log N)$
- **Correct:** C
- **Explanation:** Although there is an inner `while` loop popping elements from the stack, every element in the array is pushed onto the stack exactly once and popped at most once. The total number of stack operations across the entire algorithm is bounded by $2N$, yielding strict $O(N)$ amortized time.

#### Sample 5 (DSA - Easy)
- **Title:** PriorityQueue Default Ordering in Java
- **Prompt:** What is the default heap property maintained by `new PriorityQueue<Integer>()` in Java?
- **Options:**
  - A: Max-Heap (highest value dequeued first)
  - B: Min-Heap (lowest value dequeued first)
  - C: First-In-First-Out (FIFO) queue
  - D: Insertion order preserved
- **Correct:** B
- **Explanation:** Java's `PriorityQueue` implements a binary min-heap by default. `peek()` and `poll()` return the lowest value according to natural ordering. To create a max-heap, one must provide `Collections.reverseOrder()`.

---

### 3.2 Modality 2: Output Prediction Questions

#### Sample 1 (Java Collections - Medium)
- **Title:** Modifying Collection During Enhanced For-Loop
- **Prompt:** What is the console output of running the following code?
```java
List<String> list = new ArrayList<>(Arrays.asList("one", "two", "three"));
try {
    for (String s : list) {
        if (s.equals("two")) {
            list.remove(s);
        }
    }
    System.out.println("Size: " + list.size());
} catch (ConcurrentModificationException e) {
    System.out.println("CME Caught");
}
```
- **Expected Output:** `CME Caught`
- **Explanation:** The enhanced for-loop compiles to an internal `Iterator`. Calling `list.remove()` directly alters `modCount` without updating the iterator's `expectedModCount`. The subsequent `it.next()` detects `modCount != expectedModCount` and throws `ConcurrentModificationException`.

#### Sample 2 (Java Collections - Medium)
- **Title:** `HashMap` Key Mutation
- **Prompt:** What is the output of the following snippet?
```java
class Key {
    int id;
    Key(int id) { this.id = id; }
    public int hashCode() { return id; }
    public boolean equals(Object o) { return (o instanceof Key) && ((Key)o).id == this.id; }
}

Map<Key, String> map = new HashMap<>();
Key k = new Key(10);
map.put(k, "Value1");
k.id = 20; // Mutate key after insertion
System.out.println(map.get(k) == null);
```
- **Expected Output:** `true`
- **Explanation:** When `k.id` is mutated from 10 to 20, its `hashCode()` changes from 10 to 20. When `map.get(k)` is executed, the map looks in bucket `20 & (capacity - 1)` rather than bucket `10`. The bucket is either empty or does not contain `k`, returning `null`. This illustrates why keys in hash-based collections must be immutable.

#### Sample 3 (Java Collections - Hard)
- **Title:** `CopyOnWriteArrayList` Iterator Isolation
- **Prompt:** What does the console display?
```java
List<Integer> list = new CopyOnWriteArrayList<>(new Integer[]{1, 2, 3});
Iterator<Integer> it = list.iterator();
list.add(4);
while (it.hasNext()) {
    System.out.print(it.next() + " ");
}
```
- **Expected Output:** `1 2 3 `
- **Explanation:** An iterator on a `CopyOnWriteArrayList` holds a reference to the immutable array snapshot that existed at the exact moment the iterator was instantiated. When `list.add(4)` runs, a new underlying array of size 4 is created, leaving the iterator's snapshot untouched. Hence, the iterator only prints `1 2 3 `.

#### Sample 4 (DSA - Easy)
- **Title:** String Immutability and Substring Concatenation
- **Prompt:** What is printed?
```java
String s1 = "hello";
s1.concat(" world");
s1.toUpperCase();
System.out.println(s1);
```
- **Expected Output:** `hello`
- **Explanation:** Strings in Java are immutable. Methods like `concat()` and `toUpperCase()` return newly allocated String objects. Because their return values were not reassigned back to `s1`, `s1` remains `"hello"`.

#### Sample 5 (DSA - Medium)
- **Title:** Integer Cache Identity vs Equality
- **Prompt:** What does this code print?
```java
Integer a = 127;
Integer b = 127;
Integer c = 128;
Integer d = 128;
System.out.println((a == b) + " " + (c == d));
```
- **Expected Output:** `true false`
- **Explanation:** Java's JVM caches `Integer` objects within the range `[-128, 127]`. Values `127` refer to the identical singleton object in the pool (`a == b` is `true`). For `128`, auto-boxing calls `new Integer(128)`, producing distinct heap allocations (`c == d` is `false`).

---

### 3.3 Modality 3: Fill-in-the-Blank Questions

#### Sample 1 (Java Collections - Medium)
- **Title:** Synchronized Collection Factory
- **Prompt:** Fill in the blank to wrap an existing `ArrayList` into a thread-safe synchronized list:
```java
List<String> list = new ArrayList<>();
List<String> safeList = Collections.{{blank_1}}(list);
```
- **Accepted Answers for `blank_1`:** `["synchronizedList"]`
- **Explanation:** `Collections.synchronizedList()` wraps the target list in a proxy where every mutating method is guarded by a mutex on `this`.

#### Sample 2 (Java Collections - Easy)
- **Title:** PriorityQueue Reverse Comparator
- **Prompt:** Complete the constructor call to create a Max-Heap using standard collections utilities:
```java
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.{{blank_1}}());
```
- **Accepted Answers for `blank_1`:** `["reverseOrder"]`
- **Explanation:** `Collections.reverseOrder()` returns a `Comparator` that inverts the natural sorting order of `Comparable` objects.

#### Sample 3 (Java Collections - Medium)
- **Title:** Atomic Update in Map
- **Prompt:** Insert or compute a counter value atomically in a `Map<String, Integer>`:
```java
Map<String, Integer> counts = new HashMap<>();
counts.{{blank_1}}("item", (key, prevVal) -> prevVal == null ? 1 : prevVal + 1);
```
- **Accepted Answers for `blank_1`:** `["compute"]`
- **Explanation:** `Map.compute()` evaluates the remapping function with the key and current value to atomically determine the new value.

#### Sample 4 (DSA - Easy)
- **Title:** Binary Search Midpoint Calculation
- **Prompt:** Complete the overflow-safe midpoint calculation in binary search:
```java
int mid = low + ({{blank_1}} - low) / 2;
```
- **Accepted Answers for `blank_1`:** `["high"]`
- **Explanation:** `low + (high - low) / 2` calculates the midpoint identically to `(low + high) / 2` without causing integer overflow when `low + high > Integer.MAX_VALUE`.

#### Sample 5 (DSA - Medium)
- **Title:** Detecting Linked List Cycle with Floyd's Algorithm
- **Prompt:** Complete the fast pointer step:
```java
ListNode slow = head;
ListNode fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.{{blank_1}};
    if (slow == fast) return true;
}
return false;
```
- **Accepted Answers for `blank_1`:** `["next.next"]`
- **Explanation:** In Floyd's cycle-finding algorithm, the fast pointer advances two nodes per iteration (`fast.next.next`) while the slow pointer advances one.

---

### 3.4 Modality 4: Coding Challenges (Interactive Sandbox)

#### Sample 1 (Java Collections - Medium)
- **Title:** Implement an LRU Cache with `LinkedHashMap`
- **Prompt:** Design a data structure that follows the constraints of a Least Recently Used (LRU) Cache. Implement the `LRUCache` class with `get(int key)` and `put(int key, int value)`. Both operations must run in $O(1)$ average time.
- **Starter Code:**
```java
import java.util.*;

public class LRUCache {
    public LRUCache(int capacity) {
        // Your code here
    }
    
    public int get(int key) {
        return -1;
    }
    
    public void put(int key, int value) {
        // Your code here
    }
}
```
- **Sample Test Case:**
  - Input: `capacity = 2, put(1, 1), put(2, 2), get(1), put(3, 3), get(2)`
  - Expected: `[null, null, 1, null, -1]`

#### Sample 2 (Java Collections - Hard)
- **Title:** Custom Generic HashMap with Separate Chaining
- **Prompt:** Build a minimal generic `MyHashMap<K, V>` supporting `put(K key, V val)`, `get(K key)`, and `remove(K key)`. Handle collisions using singly linked bucket nodes and resize when size exceeds `capacity * 0.75`.
- **Constraints:** Must support `null` keys in bucket 0; cannot use `java.util.Map` internally.

#### Sample 3 (DSA - Easy)
- **Title:** Two Sum (Hash Table Approach)
- **Prompt:** Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Must achieve $O(N)$ time complexity.

#### Sample 4 (DSA - Medium)
- **Title:** Longest Substring Without Repeating Characters
- **Prompt:** Given a string `s`, find the length of the longest substring without duplicate characters using a sliding window and `HashSet` / index map.

#### Sample 5 (DSA - Hard)
- **Title:** Merge K Sorted Lists
- **Prompt:** You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it using a `PriorityQueue`.
- **Complexity Requirement:** Time $O(N \log K)$, Space $O(K)$.

---

### 3.5 Modality 5: Interview-Style Short Answer

#### Sample 1 (Java Collections)
- **Prompt:** Explain the contract between `equals()` and `hashCode()` in Java. What specific operational failure occurs if you override `equals()` without overriding `hashCode()` when using a `HashSet`?
- **Model Answer:**
  1. **Contract:** If two objects are equal according to `equals(Object)`, they **must** return the same integer from `hashCode()`. If two objects return different hash codes, they must be unequal. If they return the same hash code, they may or may not be equal (collision).
  2. **Failure in HashSet:** `HashSet` computes `bucketIndex = hash(key.hashCode()) & (n - 1)`. If `hashCode()` is not overridden, two logically identical objects will inherit `Object.hashCode()` (based on memory address), landing in different buckets. Consequently, `set.contains(identicalObject)` will calculate a different bucket, find nothing, and return `false`, causing duplicate entries and broken set uniqueness.

#### Sample 2 (Java Collections)
- **Prompt:** How does `ConcurrentHashMap` achieve high throughput in Java 8+ compared to `Hashtable` and `Collections.synchronizedMap()`?
- **Model Answer:**
  - `Hashtable` and `synchronizedMap` lock the **entire table** with a single mutex for every read and write operation, causing severe thread contention.
  - In Java 8+, `ConcurrentHashMap` eliminates segment locks in favor of:
    1. **Lock-Free Reads:** Non-blocking `volatile` reads for `get()`.
    2. **CAS (Compare-And-Swap):** Thread-safe insertions into empty buckets using `Unsafe.compareAndSwapObject` without acquiring any locks.
    3. **Synchronized Bucket Heads:** Locking only the single head node of the specific colliding bucket for updates, allowing concurrent writes to all other buckets.

#### Sample 3 (Java Collections)
- **Prompt:** Distinguish between a *Fail-Fast* and a *Fail-Safe* (weakly consistent) iterator in Java. Cite two classes from `java.util` demonstrating each.
- **Model Answer:**
  - **Fail-Fast (e.g., `ArrayList`, `HashMap`):** Iterators maintain an internal `expectedModCount`. If the underlying collection is modified during iteration without using the iterator's own `remove()` method, it immediately throws `ConcurrentModificationException`.
  - **Fail-Safe / Weakly Consistent (e.g., `CopyOnWriteArrayList`, `ConcurrentHashMap`):** Iterators traverse a snapshot or tolerate concurrent modifications without throwing `ConcurrentModificationException`. They guarantee traversal of elements as they existed at iterator creation.

#### Sample 4 (DSA)
- **Prompt:** Explain the difference between Backtracking and standard Depth-First Search (DFS). When is Backtracking mandatory?
- **Model Answer:**
  - DFS explores a search graph completely down a branch before moving to adjacent nodes, often tracking visited nodes globally to avoid re-traversal.
  - Backtracking is an optimization of brute-force search that incrementally builds candidates and abandons ("backtracks" by un-doing state changes) as soon as it determines a candidate cannot lead to a valid solution.
  - Mandatory in combinatorial generation problems (N-Queens, Sudoku, Subsets) where search paths share mutable state and choices must be reversed upon recursion exit.

#### Sample 5 (DSA)
- **Prompt:** Compare the memory overhead and cache locality of an array-backed list (`ArrayList`) versus a pointer-based doubly linked list (`LinkedList`).
- **Model Answer:**
  - **Cache Locality:** `ArrayList` stores elements in a contiguous block of memory. Modern CPU hardware prefetchers load adjacent cache lines efficiently, making linear iteration extremely fast. `LinkedList` allocates discrete `Node` objects across heap memory, leading to frequent CPU cache misses.
  - **Memory Overhead:** `ArrayList` only stores object references in an array with minimal slack capacity. `LinkedList` allocates an extra `Node` object for every element containing two 64-bit pointers (`prev` and `next`) plus object header overhead (typically 24–32 extra bytes per element on 64-bit JVMs).

---

## 4. Bulk JSON Import Schema Specification

Administrators can bulk-import question banks using the following JSON schema accepted at `POST /api/v1/admin/questions/import`:

```json
{
  "dryRun": false,
  "questions": [
    {
      "trackSlug": "java-collections",
      "topicSlug": "maps-and-hashmap-internals",
      "type": "mcq",
      "title": "HashMap Treeification Threshold",
      "difficulty": "medium",
      "prompt": "What is the threshold bucket size before treeification occurs?",
      "companyTags": ["Amazon", "Oracle"],
      "hints": ["Look at the constant TREEIFY_THRESHOLD in HashMap.java."],
      "typeSpecificData": {
        "isMultiSelect": false,
        "options": [
          { "id": "opt-1", "text": "4" },
          { "id": "opt-2", "text": "8" },
          { "id": "opt-3", "text": "16" },
          { "id": "opt-4", "text": "32" }
        ]
      },
      "solutionData": {
        "correctOptionIds": ["opt-2"],
        "explanation": "TREEIFY_THRESHOLD is set to 8 in HashMap.",
        "optionExplanations": {
          "opt-1": "Too low.",
          "opt-2": "Correct constant.",
          "opt-3": "This is DEFAULT_INITIAL_CAPACITY.",
          "opt-4": "Incorrect."
        }
      }
    }
  ]
}
```
