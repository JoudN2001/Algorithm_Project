let uploadedGraphData = null;
let myDijkstraInstance = null;
let myEnhancedDijkstraInstance = null;

const fileInput = document.getElementById("upload-btn");
const uploadText = document.getElementById("upload-text");
const runBtn = document.getElementById("run-btn");
const logOutput = document.getElementById("log-display");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const infoBtn = document.getElementById("info");
const algoButtons = document.querySelectorAll(".algorithm-btn button");
let selectedAlgorithm = "dijkstra";
const code = document.getElementById("code-display");

// info pop-up window
infoBtn.addEventListener("click", (e) => {
  const jsonTemplate = `{
    "title": "Simple Verification Map",
  "description": "Standard case to verify Dijkstra works correctly",
  "startNode": "A",
  "endNode": "C",
  "nodes": [
    { "id": "A", "x": 150, "y": 350 },
    { "id": "B", "x": 150, "y": 150 },
    { "id": "C", "x": 500, "y": 350 },
    { "id": "D", "x": 500, "y": 150 }
  ],
  "edges": [
    { "from": "A", "to": "C", "weight": 10 },
    { "from": "A", "to": "B", "weight": 2 },
    { "from": "B", "to": "D", "weight": 1 },
    { "from": "D", "to": "C", "weight": 3 },
    { "from": "C", "to": "D", "weight": 3 }
  ]
    }`;
  prompt(
    `JSON file must be like that
  Copy & edit (delete, add, modify nodes and edges)`,
    jsonTemplate
  );
});

// Handle file selection
fileInput.addEventListener("change", function (event) {
  // Get the selected file
  const file = event.target.files[0];
  // console.log(event);
  // console.log("Selected file:", file);

  // Update the upload text and read the file
  if (file) {
    uploadText.textContent = `Uploaded: ${file.name}`;

    // Create a FileReader to read the file content
    const reader = new FileReader();
    console.log(reader);
    reader.onload = function (e) {
      try {
        /* Parse the JSON content */
        uploadedGraphData = JSON.parse(e.target.result);
        // console.log("Parsed JSON data:", uploadedGraphData);
        logOutput.textContent = `> Map "${
          uploadedGraphData.title || "Untitled"
        }" loaded.\n> Nodes: ${uploadedGraphData.nodes.length}, Edges: ${
          uploadedGraphData.edges.length
        }\n> Ready to run.`;

        if (uploadedGraphData) {
          document.getElementById("canvas-placeholder").style.display = "none";
          drawDynamicGraph(uploadedGraphData);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        uploadText.textContent = "Error: Invalid JSON file.";
        logOutput.textContent = "> Error: Invalid JSON file.";
        uploadedGraphData = null;
      }
    };
    // Read the file as text(Starts the reading process)
    reader.readAsText(file);
  }
});

// selected algortim
algoButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    algoButtons.forEach((btn) => btn.classList.remove("active"));
    const clickedBtn = e.currentTarget;
    clickedBtn.classList.add("active");

    // add style feature later
    // button.append = `<i data-lucide="circle-check"></i>`;

    if (clickedBtn.id === "run-dijkstra") {
      selectedAlgorithm = "dijkstra";
      viewCode(selectedAlgorithm);
    } else if (clickedBtn.id === "run-dijkstra-pq") {
      selectedAlgorithm = "dijkstra-pq";
      viewCode(selectedAlgorithm);
    } else if (clickedBtn.id === "run-bellman") {
      selectedAlgorithm = "bellman";
      viewCode(selectedAlgorithm);
    } else if (clickedBtn.id === "run-A*") {
      selectedAlgorithm = "A*";
      viewCode(selectedAlgorithm);
    }
    console.log(`Selected Algorithm: ${selectedAlgorithm}`);
  });
});

/* Set up the Dijkstra instance and run the algorithm on button click */
runBtn.addEventListener("click", function (event) {
  if (!uploadedGraphData) {
    logOutput.textContent = "> Error: No map data uploaded.";
    alert("Invalid Map File! Missing nodes or edges.");
    return;
  } else {
    const start = performance.now();
    let instance;
    let result;

    switch (selectedAlgorithm) {
      case "dijkstra":
        console.log("Running Standard Dijkstra...");
        instance = new Dijkstra(uploadedGraphData);
        result = instance.run();
        break;
      case "dijkstra-pq":
        console.log("Running Enhanced Dijkstra...");
        instance = new PriorityQueueDijkstra(uploadedGraphData);
        result = instance.run();
        break;
      case "A*":
        console.log("Running A*...");
        // instance = new AStar(uploadedGraphData);
        // result = instance.run();
        break;
      case "bellman":
        console.log("Running Bellman-Ford...");
        // instance = new BellmanFord(uploadedGraphData);
        // result = instance.run();
        break;
      default:
        console.error("No valid algorithm selected.");
        return;
    }
    if (result) {
      const logs = result.logs.join("\n");
      const path = result.path.join(" ➝ ");
      const cost = result.cost;
      const end = performance.now();
      const runtime = end - start;
      logOutput.textContent = `> Running Dijkstra's Algorithm...\n-------------------\nDijkstra's Algorithm Logs:\n${logs}\n-------------------\nShortest Path: ${path}\nTotal Cost: ${cost}\nRuntime: ${runtime}ms`;
    }
  }
});

/* Set up the draw Graph */
function drawDynamicGraph(data) {
  if (!ctx) return;

  // 1. Setup Canvas Dimensions
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const width = canvas.width;
  const height = canvas.height;

  // 2. Clear Canvas
  ctx.clearRect(0, 0, width, height);

  // 3. SCALING LOGIC
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  data.nodes.forEach((n) => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  const padding = 40;
  const mapWidth = maxX - minX;
  const mapHeight = maxY - minY;

  // Functions to convert Map X/Y to Canvas X/Y
  const scaleX = (x) =>
    padding + ((x - minX) / mapWidth) * (width - padding * 2);
  const scaleY = (y) =>
    padding + ((y - minY) / mapHeight) * (height - padding * 2);

  // 4. Draw Edges (Lines)
  ctx.lineWidth = 2;
  ctx.font = "12px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  data.edges.forEach((edge) => {
    const fromNode = data.nodes.find((n) => n.id === edge.from);
    const toNode = data.nodes.find((n) => n.id === edge.to);

    if (fromNode && toNode) {
      const startX = scaleX(fromNode.x);
      const startY = scaleY(fromNode.y);
      const endX = scaleX(toNode.x);
      const endY = scaleY(toNode.y);

      // Draw Line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(112, 172, 77, 0.6)";
      ctx.stroke();

      // Draw Weight Label (with background)
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      ctx.beginPath();
      ctx.arc(midX, midY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#020617";
      ctx.fill();

      ctx.fillStyle = "#94A3B8";
      ctx.fillText(edge.weight, midX, midY);
    }
  });

  // 5. Draw Nodes (Circles)
  data.nodes.forEach((node) => {
    const cx = scaleX(node.x);
    const cy = scaleY(node.y);

    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);

    // Color based on type
    if (node.id === data.startNode) ctx.fillStyle = "#3B82F6";
    else if (node.id === data.endNode) ctx.fillStyle = "#EF4444";
    else ctx.fillStyle = "rgba(54, 109, 23, 1)";

    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    // Draw Label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(node.id, cx, cy);
  });
}

// reset canvas depend on window size
window.addEventListener("resize", () => {
  if (uploadedGraphData) {
    drawDynamicGraph(uploadedGraphData);
  }
});

function viewCode(selected) {
  switch (selected) {
    case "dijkstra":
      code.textContent = `/**
 * Dijkstra Algorithm Class
 * This class handles the logic for finding the shortest path in a weighted graph.
 * It converts raw JSON data into an Adjacency List and executes the algorithm.
 */
class Dijkstra {
  /**
   * Constructor
   * @param {Object} graphData - The JSON object containing nodes, edges, startNode, and endNode.
   */
  constructor(graphData) {
    // Note: We use 'this.' to define class properties. Unlike 'let' variables which are temporary to the function,
    // 'this.' properties persist and can be accessed in other methods like run().

    // We use a Map for the adjacency list for better performance (O(1) access time)
    this.adjacencyList = new Map();

    // Capture Start and End nodes from JSON configuration
    this.defaultStart = graphData.startNode || null;
    this.defaultEnd = graphData.endNode || null;
    // 1. Initialize all nodes in the adjacency list with empty arrays
    if (graphData.nodes) {
      graphData.nodes.forEach((node) => {
        this.adjacencyList.set(node.id, []);
      });
    }

    // 2. Populate the adjacency list with edges (Connections)
    if (graphData.edges) {
      graphData.edges.forEach((edge) => {
        // Check if the 'from' node exists to avoid errors
        if (this.adjacencyList.has(edge.from)) {
          this.adjacencyList.get(edge.from).push({
            to: edge.to,
            weight: Number(edge.weight),
          });
        }
      });
    }
  }

  /**
   * Helper Method: getLowestCostNode
   * Finds the unvisited node with the smallest known distance.
   * This represents the "Greedy" step of the algorithm.
   * @param {Map} distances - Current known distances.
   * @param {Set} unvisited - Set of nodes that haven't been processed yet.
   * @returns {String|null} - The ID of the node with the lowest cost.
   */
  getLowestCostNode(distances, unvisited) {
    let lowestNode = null;
    let lowestValue = Infinity;

    // Iterate through unvisited nodes to find the minimum distance
    for (let nodeId of unvisited) {
      let dist = distances.get(nodeId);
      if (dist < lowestValue) {
        lowestValue = dist;
        lowestNode = nodeId;
      }
    }
    return lowestNode;
  }

  /**
   * Main Method: run
   * Executes Dijkstra's algorithm from a start node to an end node.
   * Uses defaults from JSON if arguments are not provided.
   * @param {String} [startNodeId] - Optional override for start node.
   * @param {String} [endNodeId] - Optional override for destination node.
   * @returns {Object} - Contains found status, path array, total cost, and execution logs.
   */
  run(startNodeId = this.defaultStart, endNodeId = this.defaultEnd) {
    let logs = []; // Records steps for visualization/debugging

    // VALIDATION: Ensure start and end nodes are defined
    if (!startNodeId || !endNodeId) {
      logs.push("Error: Start or End node not defined in JSON or arguments.");
      return { found: false, path: [], cost: 0, logs: logs };
    }

    // VALIDATION: Ensure nodes exist in the graph
    if (
      !this.adjacencyList.has(startNodeId) ||
      !this.adjacencyList.has(endNodeId)
    ) {
      logs.push(
        "Error: Nodes ".concat(startNodeId, " or ").concat(endNodeId, " do not exist in the graph.");
      );
      return { found: false, path: [], cost: 0, logs: logs };
    }

    // --- Data Structures ---
    let distances = new Map(); // Stores the shortest distance from start to each node
    let previous = new Map(); // Stores the path history (breadcrumbs)
    let unvisited = new Set(); // Tracks nodes that need to be processed

    // --- Initialization ---
    // Set all distances to Infinity and add all nodes to the unvisited set
    for (let nodeId of this.adjacencyList.keys()) {
      distances.set(nodeId, Infinity);
      previous.set(nodeId, null);
      unvisited.add(nodeId);
    }

    // The distance to the start node is always 0
    distances.set(startNodeId, 0);
    logs.push("Initial state: Start at [".concat(startNodeId, "] with distance 0"););

    // --- Main Algorithm Loop ---
    while (unvisited.size > 0) {
      // Step 1: Select the unvisited node with the lowest distance
      let currentNode = this.getLowestCostNode(distances, unvisited);

      // STOP CONDITION 1: No reachable nodes left (or graph is disconnected)
      if (currentNode === null || distances.get(currentNode) === Infinity) {
        break;
      }

      // STOP CONDITION 2: Target reached
      if (currentNode === endNodeId) {
        logs.push("Target [".concat(endNodeId, "] reached!"););
        break;
      }

      // Step 2: Mark the current node as visited
      logs.push("Visiting node [".concat(currentNode, "] with current cost ").concat(distances.get(currentNode)););
      unvisited.delete(currentNode);

      // Step 3: Explore Neighbors (Relaxation Step)
      let neighbors = this.adjacencyList.get(currentNode) || [];

      for (let neighbor of neighbors) {
        // Skip nodes that have already been fully processed
        if (!unvisited.has(neighbor.to)) continue;

        // Calculate potential new distance
        let newDist = distances.get(currentNode) + neighbor.weight;
        let currentNeighborDist = distances.get(neighbor.to);

        // Debugging log (comment out in production)
        logs.push("Checking neighbor ".concat(neighbor.to, ": newDist ").concat(newDist, " vs old ").concat(currentNeighborDist););

        // If we found a shorter path, update the records
        if (newDist < currentNeighborDist) {
          distances.set(neighbor.to, newDist);
          previous.set(neighbor.to, currentNode); // Point back to where we came from

          logs.push(
            "Updated [".concat(neighbor.to, "]: old cost ").concat(currentNeighborDist, " -> new cost ").concat(newDist, " (via ").concat(currentNode, ")");
          );
        }
      }
    }

    // --- Path Reconstruction (Backtracking) ---
    let path = [];
    let current = endNodeId;

    // Check if the destination is still unreachable (Infinity)
    if (distances.get(endNodeId) === Infinity) {
      return { found: false, path: [], cost: 0, logs: logs };
    }

    // Backtrack from End to Start using the 'previous' map
    while (current !== null) {
      path.unshift(current); // Add to the beginning of the array
      current = previous.get(current);
    }

    return {
      found: true,
      path: path,
      cost: distances.get(endNodeId),
      logs: logs,
    };
  }
}
`;
      break;
    case "dijkstra-pq":
      code.textContent = `/**
 * MinHeap Class
 * Stores elements as [distance, nodeId] and sorts based on distance (index 0).
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  // Get parent index
  getParent(i) {
    return Math.floor((i - 1) / 2);
  }

  // Left child
  getLeft(i) {
    return i * 2 + 1;
  }

  // Right child
  getRight(i) {
    return i * 2 + 2;
  }

  /**
   * Adds a new element to the heap and reorders it.
   * @param {Array} val - [distance, nodeId]
   */
  push(val) {
    this.heap.push(val);
    this.heapifyUp();
  }

  // Moves the last element up to its correct position
  heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIdx = this.getParent(index);
      if (this.heap[parentIdx][0] <= this.heap[index][0]) break;
      // Swap
      [this.heap[parentIdx], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIdx],
      ];
      index = parentIdx;
    }
  }

  // remove element then
  pop() {
    if (this.isEmpty()) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop(); // remove last item rom Arraay
    if (this.heap.length > 0) {
      this.heap[0] = end; // swap between last element and root
      this.heapifyDown();
    }
    return min;
  }

  // Moves the top element down to its correct position
  heapifyDown() {
    let index = 0;
    const length = this.heap.length;
    while (true) {
      let leftIdx = this.getLeft(index);
      let rightIdx = this.getRight(index);
      let smallest = index;
      // Check Left Child
      if (leftIdx < length && this.heap[leftIdx][0] < this.heap[smallest][0]) {
        smallest = leftIdx;
      }
      // Check Right Child
      if (
        rightIdx < length &&
        this.heap[rightIdx][0] < this.heap[smallest][0]
      ) {
        smallest = rightIdx;
      }
      if (smallest === index) break;
      // Swap
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }
  // top of heap
  peak() {
    return this.heap[0];
  }
  isEmpty() {
    return this.heap.length === 0;
  }
}

class PriorityQueueDijkstra {
  constructor(graphData) {
    this.adjacencyList = new Map();

    this.defaultStart = graphData.startNode || null;
    this.defaultEnd = graphData.endNode || null;

    if (graphData.nodes) {
      graphData.nodes.forEach((node) => {
        this.adjacencyList.set(node.id, []);
      });
    }

    if (graphData.edges) {
      graphData.edges.forEach((edge) => {
        if (this.adjacencyList.has(edge.from)) {
          this.adjacencyList.get(edge.from).push({
            to: edge.to,
            weight: Number(edge.weight),
          });
        }
      });
    }
  }

  // Main Algorithm: Uses MinHeap to find the shortest path
  run(startNodeId = this.defaultStart, endNodeId = this.defaultEnd) {
    let logs = [];

    if (
      !this.adjacencyList.has(startNodeId) ||
      !this.adjacencyList.has(endNodeId)
    ) {
      logs.push("Error: Invalid Start or End Node.");
      return { found: false, cost: 0, path: [], logs: logs };
    }

    // Data Structure
    const distances = new Map();
    const previous = new Map();
    const pq = new MinHeap(); // Instance of your corrected MinHeap class

    for (const node of this.adjacencyList.keys()) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }

    // --- START ---
    distances.set(startNodeId, 0);
    pq.push([0, startNodeId]); // Format: [distance, nodeId]

    logs.push("Started at [".concat(startNodeId, "] with cost 0"););

    // --- LOOP ---
    while (!pq.isEmpty()) {
      // 1. Get the node with the SMALLEST distance
      const minNode = pq.pop();
      const currentDist = minNode[0]; // distance is index 0
      const currentNode = minNode[1]; // nodeId is index 1

      // Stop if we reached the target
      if (currentNode === endNodeId) {
        logs.push("Target [".concat(currentNode, "] reached! Cost: ").concat(currentDist););
        break;
      }

      // Skip if we found a shorter way to this node previously
      if (currentDist > distances.get(currentNode)) continue;
      logs.push("Visiting [".concat(currentNode, "] (Cost: ").concat(currentDist, ")"););

      // 2. Check Neighbors (from the Map we built in the constructor)
      const neighbors = this.adjacencyList.get(currentNode) || [];

      for (const neighbor of neighbors) {
        const newDist = currentDist + neighbor.weight;
        const oldDist = distances.get(neighbor.to);

        if (newDist < oldDist) {
          distances.set(neighbor.to, newDist);
          previous.set(neighbor.to, currentNode);

          // PUSH to Heap: This is how data enters the Heap dynamically
          pq.push([newDist, neighbor.to]);

          logs.push("Updated [".concat(neighbor.to, "]: ").concat(oldDist, " -> ").concat(newDist););
        }
      }
    }

    const path = [];
    let current = endNodeId;

    if (distances.get(endNodeId) === Infinity) {
      return { found: false, cost: 0, path: [], logs: logs };
    }

    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }

    return {
      found: true,
      cost: distances.get(endNodeId),
      path: path,
      logs: logs,
    };
  }
}
`;
      break;
    case "bellman":
      code.textContent = `code4`;
      break;
    case "A*":
      code.textContent = `code3`;
      break;
    default:
      console.error("No valid algorithm selected.");
      return;
  }
}
