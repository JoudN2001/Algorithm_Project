# ⚡ Energy Grid Navigation System – Graph Algorithms Project

This project explores the **efficiency, correctness, and limitations of graph algorithms** in the context of an **Energy Grid Navigation System**.

The core challenge is to find the most efficient path between nodes where edges represent **energy cost**.  
Crucially, the system simulates **Energy Rebates** using **negative edge weights**, which requires advanced algorithms beyond standard Dijkstra.

---

## 🚀 Features

- **Interactive Map Visualizer**
  - Upload and visualize graph topologies defined in JSON format.

- **Algorithm Implementations**
  - **Dijkstra (Linear Set)** – Baseline implementation  
    Time Complexity: `O(V²)`
  - **Dijkstra (Min-Heap / Priority Queue)** – Optimized for positive weights  
    Time Complexity: `O(E log V)`
  - **Bellman-Ford** – Handles negative weights and detects negative cycles  
    Time Complexity: `O(V · E)`

- **Performance Benchmarking**
  - Real-time logging of runtime cost and path accuracy.

- **Safety Mechanisms**
  - Detection of **Negative Cycles** (“Infinite Energy Glitches”) that break greedy algorithms.

---

## 📂 Project Structure

```text
/src
 ├── index.html                # Main application interface
 ├── script.js                 # UI logic and main controller
 ├── Dijkstra.js               # Standard Dijkstra implementation
 ├── PriorityQueueDijkstra.js  # Heap-optimized Dijkstra
 ├── BellmanFord.js            # Bellman-Ford implementation
 ├── styles.css                # Visualization styles
 └── test/                     # JSON test maps
      ├── simpleMap.json
      ├── negativeWeightFailure.json
      ├── complexNegativeCycle.json
      ├── large_performance_test.json
      ├── dangerous_negative_map.json
      ├── gps_city_map.json
      └── shuffled_performance_test.json
