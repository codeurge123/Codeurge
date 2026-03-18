/* ═══════════════════════════════════════════════════════
   SNIPPET POOL — 20+ per language
═══════════════════════════════════════════════════════ */

const variantize = (base, count, commentPrefix) =>
  Array.from(
    { length: count },
    (_, i) => `${commentPrefix} snippet ${i + 1}\n${base}`
  );

const makePool = (bases, variantsPerBase, commentPrefix) =>
  bases.flatMap((base) => variantize(base, variantsPerBase, commentPrefix));

export const POOL = {
  javascript: makePool(
    [
      `class CodeTimer {\n  constructor(duration) {\n    this.duration = duration;\n    this.remaining = duration;\n    this.interval = null;\n  }\n\n  start(onTick, onComplete) {\n    this.interval = setInterval(() => {\n      this.remaining -= 1;\n      onTick(this.remaining);\n      if (this.remaining <= 0) {\n        clearInterval(this.interval);\n        onComplete();\n      }\n    }, 1000);\n  }\n\n  reset() {\n    clearInterval(this.interval);\n    this.remaining = this.duration;\n  }\n}\n\nconst timer = new CodeTimer(60);\ntimer.start(\n  (seconds) => console.log('seconds left', seconds),\n  () => console.log('timer done')\n);`,
      `async function fetchUser(userId) {\n  try {\n    const res = await fetch("/api/users/" + userId);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error("Failed:", err);\n    return null;\n  }\n}`,
      `const throttle = (fn, delay) => {\n  let lastCall = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - lastCall >= delay) {\n      lastCall = now;\n      return fn(...args);\n    }\n  };\n};`,
      `function debounce(func, wait) {\n  let timeout;\n  return function (...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}`,
      `const deepClone = (obj) => {\n  if (obj === null || typeof obj !== "object") return obj;\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])\n  );\n};`,
    ],
    4,
    "//"
  ),
  python: makePool(
    [
      `import math\n\nclass Timer:\n    def __init__(self, duration):\n        self.duration = duration\n        self.remaining = duration\n        self.running = False\n\n    def tick(self):\n        if self.running and self.remaining > 0:\n            self.remaining -= 1\n            print(f"{self.remaining}s remaining")\n            if self.remaining == 0:\n                self.running = False\n                self.on_finish()\n\n    def start(self, on_finish):\n        self.running = True\n        self.on_finish = on_finish\n\n    def reset(self):\n        self.remaining = self.duration\n        self.running = False\n\n\ntimer = Timer(30)\ntimer.start(lambda: print("Time's up!"))\nfor _ in range(31):\n    timer.tick()`,
      `class BinaryTree:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\n    def insert(self, val):\n        if val < self.value:\n            if self.left is None:\n                self.left = BinaryTree(val)`,
      `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef count_ways(n, coins):\n    if n == 0:\n        return 1\n    if n < 0 or not coins:\n        return 0\n    return (count_ways(n - coins[0], coins) +\n            count_ways(n, coins[1:]))`,
      `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
      `import asyncio\n\nasync def gather_results(urls):\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch(session, url) for url in urls]\n        return await asyncio.gather(*tasks, return_exceptions=True)`,
    ],
    4,
    "#"
  ),
  typescript: makePool(
    [
      `type AsyncFn<T> = () => Promise<T>;

class Retry {
  static async run<T>(fn: AsyncFn<T>, attempts: number): Promise<T> {
    let lastError: unknown;
    for (let i = 1; i <= attempts; i += 1) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (i === attempts) throw lastError;
      }
    }
    throw lastError;
  }
}

async function example() {
  const result = await Retry.run(async () => {
    return await Promise.resolve('ok');
  }, 3);
  console.log(result);
}

example();`,
      `type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;`,
      `const useDebounce = <T>(value: T, delay: number): T => {\n  const [debounced, setDebounced] = useState<T>(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n};`,
      `function pipe<T>(...fns: Array<(arg: T) => T>) {\n  return (value: T): T =>\n    fns.reduce((acc, fn) => fn(acc), value);\n}\n\nconst transform = pipe(\n  (x: number) => x * 2,\n  (x: number) => x + 10,\n  (x: number) => Math.sqrt(x)\n);`,
      `class EventEmitter<E extends Record<string, unknown>> {\n  private listeners = new Map<keyof E, Set<Function>>();\n\n  on<K extends keyof E>(event: K, fn: (data: E[K]) => void) {\n    if (!this.listeners.has(event))\n      this.listeners.set(event, new Set());\n    this.listeners.get(event)!.add(fn);\n  }\n}`,
    ],
    4,
    "//"
  ),
  rust: makePool(
    [
      `use std::collections::HashMap;

struct LruCache<K, V> {
    capacity: usize,
    map: HashMap<K, V>,
    order: Vec<K>,
}

impl<K: Clone + Eq + std::hash::Hash, V> LruCache<K, V> {
    fn new(capacity: usize) -> Self {
        LruCache { capacity, map: HashMap::new(), order: Vec::new() }
    }

    fn put(&mut self, key: K, value: V) {
        if self.map.contains_key(&key) {
            self.order.retain(|k| k != &key);
        }
        self.order.push(key.clone());
        self.map.insert(key, value);
        if self.order.len() > self.capacity {
            if let Some(old) = self.order.remove(0) {
                self.map.remove(&old);
            }
        }
    }
}

fn main() {
    let mut cache = LruCache::new(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    cache.put("d", 4);
}`,
      `use std::collections::HashMap;

struct LruCache<K, V> {
    capacity: usize,
    map: HashMap<K, V>,
    order: Vec<K>,
}

impl<K: Clone + Eq + std::hash::Hash, V> LruCache<K, V> {
    fn new(cap: usize) -> Self {
        LruCache { capacity: cap, map: HashMap::new(), order: Vec::new() }
    }
}`,
      `async fn retry<T, E, F, Fut>(mut f: F, attempts: usize) -> Result<T, E>\nwhere\n    F: FnMut() -> Fut,\n    Fut: Future<Output = Result<T, E>>,\n{\n    for _ in 0..attempts - 1 {\n        if let Ok(val) = f().await { return Ok(val); }\n    }\n    f().await\n}`,
      `#[derive(Debug, Clone)]\npub struct Matrix {\n    rows: usize,\n    cols: usize,\n    data: Vec<f64>,\n}\n\nimpl Matrix {\n    pub fn new(rows: usize, cols: usize) -> Self {\n        Matrix { rows, cols, data: vec![0.0; rows * cols] }\n    }\n}`,
      `fn flatten<T: Clone>(nested: Vec<Vec<T>>) -> Vec<T> {\n    nested.into_iter().flatten().collect()\n}\n\nfn chunk<T: Clone>(vec: Vec<T>, size: usize) -> Vec<Vec<T>> {\n    vec.chunks(size).map(|c| c.to_vec()).collect()\n}`,
    ],
    4,
    "//"
  ),
  go: makePool(
    [
      `package main

import (
    "fmt"
    "sync"
)

type WorkerPool struct {
    jobs chan func()
    wg   sync.WaitGroup
}

func NewPool(size int) *WorkerPool {
    p := &WorkerPool{jobs: make(chan func(), 100)}
    for i := 0; i < size; i++ {
        go func() {
            for job := range p.jobs {
                job()
            }
        }()
    }
    return p
}

func (p *WorkerPool) Submit(job func()) {
    p.wg.Add(1)
    p.jobs <- func() {
        defer p.wg.Done()
        job()
    }
}

func (p *WorkerPool) Wait() {
    p.wg.Wait()
}

func main() {
    pool := NewPool(4)
    for i := 0; i < 10; i++ {
        n := i
        pool.Submit(func() { fmt.Println("job", n) })
    }
    pool.Wait()
}`,
      `type WorkerPool struct {\n    jobs chan func()\n    wg   sync.WaitGroup\n}\n\nfunc NewPool(size int) *WorkerPool {\n    p := &WorkerPool{jobs: make(chan func(), 100)}\n    for i := 0; i < size; i++ {\n        go func() {\n            for job := range p.jobs { job() }\n        }()\n    }\n    return p\n}`,
      `func middleware(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        start := time.Now()\n        defer func() {\n            log.Printf("%s %s %v",\n                r.Method, r.URL.Path, time.Since(start))\n        }()\n        next.ServeHTTP(w, r)\n    })\n}`,
      `func memoize(fn func(int) int) func(int) int {\n    cache := make(map[int]int)\n    var mu sync.RWMutex\n    return func(n int) int {\n        mu.RLock()\n        if v, ok := cache[n]; ok { mu.RUnlock(); return v }\n        mu.RUnlock()\n        result := fn(n)\n        mu.Lock()\n        cache[n] = result\n        mu.Unlock()\n        return result\n    }\n}`,
      `func mergeChannels[T any](channels ...<-chan T) <-chan T {\n    merged := make(chan T)\n    var wg sync.WaitGroup\n    for _, ch := range channels {\n        wg.Add(1)\n        go func(c <-chan T) {\n            defer wg.Done()\n            for v := range c { merged <- v }\n        }(ch)\n    }\n    go func() { wg.Wait(); close(merged) }()\n    return merged\n}`,
    ],
    4,
    "//"
  ),
  cpp: makePool(
    [
      `#include <algorithm>\n#include <functional>\n#include <future>\n#include <iostream>\n#include <mutex>\n#include <queue>\n#include <thread>\n#include <vector>\n\nclass ThreadPool {\npublic:\n    ThreadPool(size_t n) {\n        for (size_t i = 0; i < n; ++i) {\n            workers.emplace_back([this] { run(); });\n        }\n    }\n\n    ~ThreadPool() {\n        {\n            std::unique_lock<std::mutex> lock(m);\n            stop = true;\n        }\n        cv.notify_all();\n        for (auto &w : workers) w.join();\n    }\n\n    template<typename F, typename... Args>\n    auto enqueue(F&& f, Args&&... args) {\n        using return_type = std::invoke_result_t<F, Args...>;\n        auto task = std::make_shared<std::packaged_task<return_type()>>(\n            std::bind(std::forward<F>(f), std::forward<Args>(args)... )\n        );\n        {\n            std::unique_lock<std::mutex> lock(m);\n            tasks.emplace([task]() { (*task)(); });\n        }\n        cv.notify_one();\n        return task->get_future();\n    }\n\nprivate:\n    void run() {\n        while (true) {\n            std::function<void()> task;\n            {\n                std::unique_lock<std::mutex> lock(m);\n                cv.wait(lock, [this] { return stop || !tasks.empty(); });\n                if (stop && tasks.empty()) return;\n                task = std::move(tasks.front());\n                tasks.pop();\n            }\n            task();\n        }\n    }\n\n    std::vector<std::thread> workers;\n    std::queue<std::function<void()>> tasks;\n    std::mutex m;\n    std::condition_variable cv;\n    bool stop = false;\n};\n\nint main() {\n    ThreadPool pool(4);\n    auto future = pool.enqueue([] { return 42; });\n    std::cout << future.get() << std::endl;\n}\n`,
      `int longestCommon(const string& a, const string& b) {\n    int m = a.size(), n = b.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++)\n            dp[i][j] = a[i-1]==b[j-1]\n                ? dp[i-1][j-1]+1\n                : max(dp[i-1][j], dp[i][j-1]);\n    return dp[m][n];\n}`,
      `class ThreadPool {\n    vector<thread> workers;\n    queue<function<void()>> tasks;\n    mutex mtx;\n    condition_variable cv;\n    atomic<bool> stop{false};\npublic:\n    explicit ThreadPool(size_t n) {\n        for (size_t i = 0; i < n; ++i)\n            workers.emplace_back([this] { run(); });\n    }\n};`,
      `template<typename C, typename Pred>\nauto filter(const C& c, Pred pred) {\n    C result;\n    copy_if(begin(c), end(c), back_inserter(result), pred);\n    return result;\n}\n\ntemplate<typename C, typename Fn>\nauto map_all(const C& c, Fn fn) {\n    vector<decltype(fn(*begin(c)))> result;\n    transform(begin(c), end(c), back_inserter(result), fn);\n    return result;\n}`,
      `struct TreeNode {\n    int val;\n    TreeNode* left = nullptr;\n    TreeNode* right = nullptr;\n    TreeNode(int v) : val(v) {}\n};\n\nint maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left),\n                   maxDepth(root->right));\n}`,
    ],
    4,
    "//"
  ),
};

export const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "cpp", label: "C++" },
];
export const DURATIONS = [15, 30, 60, 120];
