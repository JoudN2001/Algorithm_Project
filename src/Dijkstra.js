/**
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
        `Error: Nodes ${startNodeId} or ${endNodeId} do not exist in the graph.`
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
    logs.push(`Initial state: Start at [${startNodeId}] with distance 0`);

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
        logs.push(`Target [${endNodeId}] reached!`);
        break;
      }

      // Step 2: Mark the current node as visited
      logs.push(
        `Visiting node [${currentNode}] with current cost ${distances.get(
          currentNode
        )}`
      );
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
        logs.push(
          `Checking neighbor ${neighbor.to}: newDist ${newDist} vs old ${currentNeighborDist}`
        );

        // If we found a shorter path, update the records
        if (newDist < currentNeighborDist) {
          distances.set(neighbor.to, newDist);
          previous.set(neighbor.to, currentNode); // Point back to where we came from

          logs.push(
            `Updated [${neighbor.to}]: old cost ${currentNeighborDist} -> new cost ${newDist} (via ${currentNode})`
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
