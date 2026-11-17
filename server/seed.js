import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Snippet from './models/Snippet.js';

dotenv.config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const categories = [
  { name: 'Data Structures' },
  { name: 'Algorithms' },
  { name: 'Web Development' },
  { name: 'Database' },
  { name: 'Python Basics' },
];

const getSnippets = (catMap) => [
  // ── Data Structures ──
  {
    categoryId: catMap['Data Structures'],
    title: 'Linked List Implementation',
    language: 'cpp',
    difficulty: 'Medium',
    tags: ['linked-list', 'pointers', 'oop'],
    description: 'A singly linked list with insert, delete, and display operations.',
    timeComplexity: 'O(n)',
    favorite: true,
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    void insertFront(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }

    void deleteFront() {
        if (!head) return;
        Node* temp = head;
        head = head->next;
        delete temp;
    }

    void display() {
        Node* curr = head;
        while (curr) {
            cout << curr->data << " -> ";
            curr = curr->next;
        }
        cout << "NULL" << endl;
    }
};

int main() {
    LinkedList ll;
    ll.insertFront(10);
    ll.insertFront(20);
    ll.insertFront(30);
    ll.display(); // 30 -> 20 -> 10 -> NULL
    ll.deleteFront();
    ll.display(); // 20 -> 10 -> NULL
    return 0;
}`,
    gNotes: [
      { text: 'Remember: always check for nullptr before deleting', x: 40, y: 30, width: 200 },
      { text: 'Time: O(1) insert at front, O(n) for search', x: 300, y: 80, width: 190 },
    ],
  },
  {
    categoryId: catMap['Data Structures'],
    title: 'Stack using Array',
    language: 'c',
    difficulty: 'Easy',
    tags: ['stack', 'array', 'LIFO'],
    description: 'Basic stack implementation using a fixed-size array with push, pop, and peek.',
    timeComplexity: 'O(1)',
    favorite: false,
    code: `#include <stdio.h>
#define MAX 100

int stack[MAX], top = -1;

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow\\n");
        return;
    }
    stack[++top] = val;
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow\\n");
        return -1;
    }
    return stack[top--];
}

int peek() {
    if (top == -1) return -1;
    return stack[top];
}

int main() {
    push(10);
    push(20);
    push(30);
    printf("Top: %d\\n", peek());  // 30
    printf("Popped: %d\\n", pop()); // 30
    printf("Top: %d\\n", peek());  // 20
    return 0;
}`,
    gNotes: [],
  },
  {
    categoryId: catMap['Data Structures'],
    title: 'Binary Search Tree',
    language: 'java',
    difficulty: 'Hard',
    tags: ['BST', 'tree', 'recursion'],
    description: 'Binary Search Tree with insert, search, and inorder traversal.',
    timeComplexity: 'O(log n) avg, O(n) worst',
    favorite: true,
    code: `class BST {
    static class Node {
        int key;
        Node left, right;
        Node(int item) {
            key = item;
            left = right = null;
        }
    }

    Node root;

    BST() { root = null; }

    void insert(int key) {
        root = insertRec(root, key);
    }

    Node insertRec(Node root, int key) {
        if (root == null) return new Node(key);
        if (key < root.key) root.left = insertRec(root.left, key);
        else if (key > root.key) root.right = insertRec(root.right, key);
        return root;
    }

    boolean search(int key) {
        return searchRec(root, key);
    }

    boolean searchRec(Node root, int key) {
        if (root == null) return false;
        if (root.key == key) return true;
        return key < root.key
            ? searchRec(root.left, key)
            : searchRec(root.right, key);
    }

    void inorder() { inorderRec(root); }

    void inorderRec(Node root) {
        if (root != null) {
            inorderRec(root.left);
            System.out.print(root.key + " ");
            inorderRec(root.right);
        }
    }

    public static void main(String[] args) {
        BST tree = new BST();
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        tree.insert(20);
        tree.insert(40);
        tree.inorder(); // 20 30 40 50 70
        System.out.println("\\nSearch 40: " + tree.search(40)); // true
    }
}`,
    gNotes: [
      { text: 'Inorder traversal of BST always gives sorted output!', x: 60, y: 50, width: 210 },
    ],
  },

  // ── Algorithms ──
  {
    categoryId: catMap['Algorithms'],
    title: 'Binary Search',
    language: 'cpp',
    difficulty: 'Easy',
    tags: ['search', 'divide-and-conquer', 'sorted-array'],
    description: 'Classic binary search on a sorted array. Returns index of target or -1.',
    timeComplexity: 'O(log n)',
    favorite: true,
    code: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 45, 67, 91};
    int target = 23;

    int result = binarySearch(arr, target);
    if (result != -1)
        cout << "Found at index " << result << endl;
    else
        cout << "Not found" << endl;

    return 0;
}`,
    gNotes: [
      { text: 'Use low + (high-low)/2 to avoid integer overflow', x: 50, y: 40, width: 200 },
    ],
  },
  {
    categoryId: catMap['Algorithms'],
    title: 'Merge Sort',
    language: 'python',
    difficulty: 'Medium',
    tags: ['sorting', 'divide-and-conquer', 'recursion'],
    description: 'Divide and conquer sorting algorithm. Stable sort with guaranteed O(n log n).',
    timeComplexity: 'O(n log n)',
    favorite: false,
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example
arr = [38, 27, 43, 3, 9, 82, 10]
sorted_arr = merge_sort(arr)
print(f"Sorted: {sorted_arr}")
# Output: Sorted: [3, 9, 10, 27, 38, 43, 82]`,
    gNotes: [
      { text: 'Stable sort — preserves order of equal elements', x: 30, y: 20, width: 200 },
      { text: 'Space complexity: O(n) due to temporary arrays', x: 280, y: 100, width: 190 },
    ],
  },
  {
    categoryId: catMap['Algorithms'],
    title: 'Dijkstra Shortest Path',
    language: 'python',
    difficulty: 'Hard',
    tags: ['graph', 'shortest-path', 'greedy'],
    description: 'Finds shortest path from source to all vertices in a weighted graph using a priority queue.',
    timeComplexity: 'O((V + E) log V)',
    favorite: false,
    code: `import heapq

def dijkstra(graph, source):
    distances = {node: float('inf') for node in graph}
    distances[source] = 0
    pq = [(0, source)]

    while pq:
        curr_dist, curr_node = heapq.heappop(pq)

        if curr_dist > distances[curr_node]:
            continue

        for neighbor, weight in graph[curr_node]:
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances

# Example graph (adjacency list)
graph = {
    'A': [('B', 4), ('C', 1)],
    'B': [('D', 1)],
    'C': [('B', 2), ('D', 5)],
    'D': []
}

result = dijkstra(graph, 'A')
for node, dist in result.items():
    print(f"A -> {node}: {dist}")
# A -> A: 0
# A -> B: 3
# A -> C: 1
# A -> D: 4`,
    gNotes: [
      { text: 'Does NOT work with negative edge weights — use Bellman-Ford instead', x: 40, y: 60, width: 220 },
    ],
  },

  // ── Web Development ──
  {
    categoryId: catMap['Web Development'],
    title: 'Express REST API Boilerplate',
    language: 'javascript',
    difficulty: 'Easy',
    tags: ['express', 'REST', 'node', 'boilerplate'],
    description: 'Minimal Express.js server with CRUD endpoints for a resource.',
    timeComplexity: '',
    favorite: false,
    code: `import express from 'express';
const app = express();
app.use(express.json());

let items = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' },
];

// GET all
app.get('/api/items', (req, res) => {
  res.json(items);
});

// GET by id
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === +req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST create
app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), name: req.body.name };
  items.push(item);
  res.status(201).json(item);
});

// DELETE
app.delete('/api/items/:id', (req, res) => {
  items = items.filter(i => i.id !== +req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => console.log('Server on port 3000'));`,
    gNotes: [],
  },
  {
    categoryId: catMap['Web Development'],
    title: 'React useEffect Cleanup Pattern',
    language: 'javascript',
    difficulty: 'Medium',
    tags: ['react', 'hooks', 'useEffect', 'cleanup'],
    description: 'Demonstrates proper cleanup in useEffect to avoid memory leaks with async operations.',
    timeComplexity: '',
    favorite: true,
    code: `import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;         // cleanup flag

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(\`/api/users/\${userId}\`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        if (!cancelled) {          // only update if still mounted
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {                 // cleanup on unmount or userId change
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{user.name}</h1>;
}

export default UserProfile;`,
    gNotes: [
      { text: 'The cancelled flag prevents setState on unmounted component', x: 50, y: 45, width: 210 },
    ],
  },

  // ── Database ──
  {
    categoryId: catMap['Database'],
    title: 'SQL JOIN Types',
    language: 'sql',
    difficulty: 'Medium',
    tags: ['SQL', 'JOIN', 'tables', 'relational'],
    description: 'Examples of INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.',
    timeComplexity: '',
    favorite: false,
    code: `-- Sample Tables
-- employees(id, name, dept_id)
-- departments(id, dept_name)

-- INNER JOIN: only matching rows
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT JOIN: all employees, even without a department
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;

-- RIGHT JOIN: all departments, even without employees
SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;

-- FULL OUTER JOIN: all rows from both tables
SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.id;

-- Self JOIN: employees with their managers
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`,
    gNotes: [
      { text: 'INNER = intersection, LEFT = all from left table, RIGHT = all from right', x: 30, y: 25, width: 230 },
    ],
  },
  {
    categoryId: catMap['Database'],
    title: 'MongoDB Aggregation Pipeline',
    language: 'javascript',
    difficulty: 'Hard',
    tags: ['mongodb', 'aggregation', 'pipeline', 'NoSQL'],
    description: 'Common aggregation pipeline stages: $match, $group, $sort, $project, $lookup.',
    timeComplexity: '',
    favorite: false,
    code: `// MongoDB Aggregation Pipeline Examples
// Collection: orders { customer, product, amount, date, status }

// 1. Total revenue per customer (sorted descending)
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$customer",
      totalSpent: { $sum: "$amount" },
      orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } },
  { $project: {
      customer: "$_id",
      totalSpent: 1,
      orderCount: 1,
      _id: 0
  }}
]);

// 2. Join with customers collection (like SQL JOIN)
db.orders.aggregate([
  { $lookup: {
      from: "customers",
      localField: "customer",
      foreignField: "_id",
      as: "customerInfo"
  }},
  { $unwind: "$customerInfo" },
  { $project: {
      product: 1,
      amount: 1,
      customerName: "$customerInfo.name",
      customerEmail: "$customerInfo.email"
  }}
]);

// 3. Monthly sales report
db.orders.aggregate([
  { $group: {
      _id: { $month: "$date" },
      revenue: { $sum: "$amount" },
      avgOrder: { $avg: "$amount" },
      count: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
]);`,
    gNotes: [],
  },

  // ── Python Basics ──
  {
    categoryId: catMap['Python Basics'],
    title: 'List Comprehensions',
    language: 'python',
    difficulty: 'Easy',
    tags: ['python', 'list', 'comprehension', 'one-liner'],
    description: 'Common list comprehension patterns in Python for filtering and transforming data.',
    timeComplexity: 'O(n)',
    favorite: false,
    code: `# Basic list comprehension
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition (filter)
evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# String manipulation
words = ["hello", "world", "python"]
upper = [w.upper() for w in words]
print(upper)  # ['HELLO', 'WORLD', 'PYTHON']

# Nested comprehension (flatten 2D list)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Dictionary comprehension
word = "abracadabra"
freq = {ch: word.count(ch) for ch in set(word)}
print(freq)  # {'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1}

# Conditional expression (if-else)
labels = ["even" if x % 2 == 0 else "odd" for x in range(5)]
print(labels)  # ['even', 'odd', 'even', 'odd', 'even']`,
    gNotes: [
      { text: 'Comprehensions are faster than equivalent for-loops in Python', x: 50, y: 30, width: 200 },
    ],
  },
  {
    categoryId: catMap['Python Basics'],
    title: 'File I/O with Context Manager',
    language: 'python',
    difficulty: 'Easy',
    tags: ['python', 'file', 'io', 'with-statement'],
    description: 'Reading and writing files using the with statement for automatic resource cleanup.',
    timeComplexity: 'O(n)',
    favorite: false,
    code: `# Writing to a file
with open("output.txt", "w") as f:
    f.write("Line 1\\n")
    f.write("Line 2\\n")
    f.write("Line 3\\n")

# Reading entire file
with open("output.txt", "r") as f:
    content = f.read()
    print(content)

# Reading line by line (memory efficient for large files)
with open("output.txt", "r") as f:
    for line in f:
        print(line.strip())

# Reading into a list
with open("output.txt", "r") as f:
    lines = f.readlines()
    print(lines)  # ['Line 1\\n', 'Line 2\\n', 'Line 3\\n']

# Appending to a file
with open("output.txt", "a") as f:
    f.write("Line 4\\n")

# Reading and writing CSV-like data
data = [
    ["Name", "Age", "City"],
    ["Alice", "25", "New York"],
    ["Bob", "30", "London"],
]

with open("data.csv", "w") as f:
    for row in data:
        f.write(",".join(row) + "\\n")

# Reading CSV back
with open("data.csv", "r") as f:
    for line in f:
        fields = line.strip().split(",")
        print(fields)`,
    gNotes: [],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Snippet.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const createdCats = await Category.insertMany(categories);
    const catMap = {};
    createdCats.forEach((c) => {
      catMap[c.name] = c._id;
    });
    console.log(`Created ${createdCats.length} categories`);

    // Create snippets
    const snippets = getSnippets(catMap);
    const createdSnippets = await Snippet.insertMany(snippets);
    console.log(`Created ${createdSnippets.length} snippets`);

    // Summary
    console.log('\n── Seed Summary ──');
    for (const cat of createdCats) {
      const count = snippets.filter(
        (s) => s.categoryId.toString() === cat._id.toString()
      ).length;
      console.log(`  ${cat.name}: ${count} snippets`);
    }

    const favCount = snippets.filter((s) => s.favorite).length;
    const noteCount = snippets.reduce((sum, s) => sum + s.gNotes.length, 0);
    console.log(`\n  Favorites: ${favCount}`);
    console.log(`  GNotes: ${noteCount}`);
    console.log('\n✅ Database seeded successfully!');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
