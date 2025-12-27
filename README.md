# **🗺️ Route Optimizer: Algorithm Design & Implementation**

A comprehensive study on optimal route planning, evolving from greedy search strategies to dynamic programming for modern logistics and energy grids.

## **📖 Project Overview**

**Route Optimizer** is a web-based application designed to simulate and solve the **Single-Source Shortest Path (SSSP)** problem for delivery logistics.

The project was developed in three academic phases, progressing from theoretical design to a robust implementation capable of handling complex edge cases like **"Energy Rebates" (Negative Weights)** in Electric Vehicle (EV) networks.

**Key Goals:**

* Minimize travel cost/distance/time.  
* Visualize graph traversal algorithms in real-time.  
* Compare algorithmic efficiency $O(V^2)$ vs $O(E \\log V)$ vs $O(VE)$.  
* Address the limitations of Classical Computing regarding NP-Hard problems (TSP).

## **🚀 Key Features**

* **Dynamic Graph Visualization:** Renders nodes and edges dynamically using the **HTML5 Canvas API** with auto-scaling coordinates.  
* **Mobile-First Design:** Fully responsive UI/UX designed for field usage on mobile devices.  
* **Custom Map Import:** Accepts JSON file uploads to test various graph topologies (Cyclic, Disconnected, Trap Maps).  
* **Multiple Algorithm Engines:**  
  * **Dijkstra (Linear):** Baseline implementation for dense graphs $O(V^2)$.  
  * **Dijkstra (Min-Heap):** Optimized implementation using a Priority Queue for sparse networks $O(E \\log V)$.  
  * **Bellman-Ford:** Robust engine for graphs with negative weights (Energy Rebates) and negative cycle detection $O(VE)$.  
* **Performance Metrics:** Displays real-time execution logs, runtime comparisons, and cost analysis.

## **🛠️ Tech Stack**

* **Frontend:** HTML5, CSS3 (Flexbox/Grid, CSS Variables), Lucide Icons.  
* **Logic:** Vanilla JavaScript (ES6+ Classes).  
* **Visualization:** HTML5 Canvas API (2D Context).  
* **Tools:** VS Code, Git, Figma (UI Design).

## **📂 Project Structure**
```
Algorithm\_Project/  
├── docs/                   # Academic Reports & Proposals  
│   ├── phase-1-proposal.pdf  
│   ├── phase-2-proposal.pdf  
│   ├── phase-3-proposal.pdf  
│   └── final-presentation.pdf  
├── src/                    # Source Code  
│   ├── index.html          # Main Application Entry  
│   ├── map\_viewer.html     # Dedicated map viewing tool  
│   ├── styles.css          # Mobile-First Styling  
│   ├── script.js           # DOM Manipulation & Rendering Logic  
│   ├── Dijkstra.js         # Standard Dijkstra Implementation (Set)  
│   ├── PriorityQueueDijkstra.js # Optimized Dijkstra (Min-Heap)  
│   ├── BellmanFord.js      # Bellman-Ford Implementation  
│   └── normalize.css       # Browser Reset  
└── test/                   # JSON Test Cases  
    ├── simpleMap.json                  # Standard verification  
    ├── theTrapMap.json                 # Performance trap for Greedy algos  
    ├── negativeWeightFailure.json      # Fails Dijkstra, requires Bellman-Ford  
    ├── dangerous_negative_map.json     # Complex energy rebate scenario  
    ├── complexNegativeCycle.json       # Infinite energy loop detection  
    ├── gps_city_map.json               # Large scale map simulation  
    ├── large_performance_test.json     # Stress testing  
    ├── shuffled_performance_test.json  # Randomized edge order testing  
    └── shuffled_performance_test_with_ngative.json # Bellman-Ford stress test
```
## **🧪 Testing & Analysis**

We rigorously tested the system against distinct topologies to validate correctness and performance.

### **1\. The Simple Map (Sanity Check)**

* **Goal:** Verify basic pathfinding.  
* **Result:** All algorithms correctly identify the shortest path ($S \\to B \\to D \\to C$).

### **2\. The "Trap Map" (Performance)**

* **Goal:** Expose the weakness of uninformed search.  
* **Observation:** Dijkstra blindly explores low-cost local paths before finding the global optimum, highlighting the trade-off between greedy search and heuristic guidance.

### **3\. The "Dangerous Map" (Negative Weights)**

* **Goal:** Simulate EV Regenerative Braking (Negative Edge Weights).  
* **Critical Finding:**  
  * **Dijkstra (Set & Heap):** Fails. Returns a suboptimal path (Cost: \-179) because it assumes paths never get shorter after visiting a node.  
  * **Bellman-Ford:** Succeeds. Finds the true optimal path (Cost: \-227) by relaxing edges $|V|-1$ times.

## **📊 Complexity Comparison**

| Algorithm | Data Structure | Time Complexity | Suitability |
| :---- | :---- | :---- | :---- |
| **Dijkstra (Phase 2)** | Linear Set | $O(V^2)$ | Dense Graphs, Small Datasets |
| **Dijkstra (Phase 3)** | Min-Heap | $O((V+E) \\log V)$ | Sparse Graphs, Standard Navigation |
| **Bellman-Ford** | Edge List | $O(V \\cdot E)$ | **Energy Grids (Negative Weights)** |

## **⚡ How to Run**

1. **Clone the repository:**  
```bash
git clone https://github.com/JoudN2001/Algorithm_Project.git
```

2. Open the Application:  
   Simply open src/index.html in any modern web browser. No backend server or installation is required.  
3. Upload a Map:  
   Use the sample JSON files located in the src/test/ folder to visualize and run the algorithms.

## **👥 Team & Course Info**

**Course:** Algorithm Design and Implementation (2025/2026)

**Instructor:** Dr. Mohammed Abuhelaleh

**Team Members:**

* **Joud Kayyali** (3230601030)  

*"We do not live in a utopia, but we strive to create it."* — This project represents our journey from naive implementation to understanding the fundamental limits of computation (P vs NP).

