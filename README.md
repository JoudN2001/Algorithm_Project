# **🗺️ Route Optimizer: Algorithm Design & Implementation**

A comprehensive study on optimal route planning, evolving from greedy search strategies to dynamic programming for modern logistics and energy grids.

## **📖 Project Overview**

**Route Optimizer** is a web-based application designed to simulate and solve the **Single-Source Shortest Path (SSSP)** problem for delivery logistics.

The project was developed in three academic phases, moving from theoretical design to a robust implementation capable of handling complex edge cases like **"Energy Rebates" (Negative Weights)** in Electric Vehicle (EV) networks.

**Key Goals:**

- Minimize travel cost/distance/time.
- Visualize graph traversal algorithms in real-time.
- Compare algorithmic efficiency ($O(V^2)$ vs $O(E \\log V)$ vs $O(VE)$).
- Address the limitations of Classical Computing regarding NP-Hard problems (TSP).

## **🚀 Key Features**

- **Dynamic Graph Visualization:** Renders nodes and edges dynamically using the **HTML5 Canvas API** with auto-scaling coordinates.
- **Mobile-First Design:** Fully responsive UI/UX designed for field usage on mobile devices.
- **Custom Map Import:** Accepts JSON file uploads to test various graph topologies (Cyclic, Disconnected, Trap Maps).
- **Multiple Engines:**
  - **Dijkstra (Linear):** Baseline implementation for dense graphs.
  - **Dijkstra (Min-Heap):** Optimized implementation for sparse networks ($O(E \\log V)$).
  - **Bellman-Ford:** Robust engine for graphs with negative weights (Energy Rebates) and cycle detection.
- **Performance Metrics:** Displays real-time execution logs and cost analysis.

## **🛠️ Tech Stack**

- **Frontend:** HTML5, CSS3 (Flexbox/Grid, CSS Variables), Lucide Icons.
- **Logic:** Vanilla JavaScript (ES6+ Classes).
- **Visualization:** HTML5 Canvas API (2D Context).
- **Tools:** VS Code, Git, Figma (UI Design).

## **📂 Project Structure**

```text
Algorithm_Project/
├── docs/                   # Academic Reports & Proposals
│   ├── phase-1-proposal.pdf
│   ├── phase-2-proposal.pdf
│   └── phase-3-final-report.pdf
├── src/                    # Source Code
│   ├── index.html          # Main Application Entry
│   ├── styles.css          # Mobile-First Styling
│   ├── script.js           # DOM Manipulation & Rendering Logic
│   ├── Dijkstra.js         # Algorithm Implementations (Class-based)
│   └── normalize.css       # Browser Reset
└── test/                   # JSON Test Cases
    ├── simpleMap.json      # Standard verification
    ├── theTrapMap.json     # Performance trap for greedy algorithms
    └── negativeWeight.json # Requires Bellman-Ford
```

## **🧪 Testing & Analysis**

We rigorously tested the system against three distinct topologies to validate correctness and performance.

### **1\. The Simple Map (Sanity Check)**

- **Goal:** Verify basic pathfinding.
- **Result:** All algorithms correctly identify the shortest path ($S \\to B \\to D \\to C$).

### **2\. The "Trap Map" (Performance)**

- **Goal:** Expose the weakness of uninformed search.
- **Observation:** Dijkstra blindly explores low-cost local paths before finding the global optimum, highlighting the need for Heuristics ($A^\*$) in future work.

### **3\. The "Dangerous Map" (Negative Weights)**

- **Goal:** Simulate EV Regenerative Braking (Negative Edge Weights).
- **Critical Finding:**
  - **Dijkstra:** Fails. Returns a suboptimal path (Cost: \-179) because it assumes paths never get shorter.
  - **Bellman-Ford:** Succeeds. Finds the true optimal path (Cost: \-227) by relaxing edges $|V|-1$ times.

## **📊 Complexity Comparison**

| Algorithm               | Data Structure | Time Complexity    | Suitability                         |
| :---------------------- | :------------- | :----------------- | :---------------------------------- |
| **Dijkstra (Phase 2\)** | Linear Set     | $O(V^2)$           | Dense Graphs, Small Datasets        |
| **Dijkstra (Phase 3\)** | Min-Heap       | $O((V+E) \\log V)$ | Sparse Graphs, Standard Navigation  |
| **Bellman-Ford**        | Edge List      | $O(V \\cdot E)$    | **Energy Grids (Negative Weights)** |

## **⚡ How to Run**

1. **Clone the repository:**  
   `    git clone https://github.com/JoudN2001/Algorithm\_Project.git    `

2. Open the Application:  
   Simply open src/index.html in any modern web browser. No backend server or installation is required.
3. Upload a Map:  
   Use the sample JSON files located in the src/test/ folder to visualize and run the algorithms.

## **👥 Team & Course Info**

**Course:** Algorithm Design and Implementation (2025/2026)

**Instructor:** Dr. Mohammed Abuhelaleh

**Team Members:**

- **Joud Kayyali** (3230601030)

_"We do not live in a utopia, but we strive to create it."_ — This project represents our journey from naive implementation to understanding the fundamental limits of computation (P vs NP).
