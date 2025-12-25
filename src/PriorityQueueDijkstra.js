/**
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

    logs.push(`Started at [${startNodeId}] with cost 0`);

    // --- LOOP ---
    while (!pq.isEmpty()) {
      // 1. Get the node with the SMALLEST distance
      const minNode = pq.pop();
      const currentDist = minNode[0]; // distance is index 0
      const currentNode = minNode[1]; // nodeId is index 1

      // Stop if we reached the target
      if (currentNode === endNodeId) {
        logs.push(`Target [${currentNode}] reached! Cost: ${currentDist}`);
        break;
      }

      // Skip if we found a shorter way to this node previously
      if (currentDist > distances.get(currentNode)) continue;
      logs.push(`Visiting [${currentNode}] (Cost: ${currentDist})`);

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

          logs.push(`Updated [${neighbor.to}]: ${oldDist} -> ${newDist}`);
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
