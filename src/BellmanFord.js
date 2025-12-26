class BellmanFord {
  constructor(graphData) {
    /**
     * Constructor
     * @param {Object} graphData - JSON with nodes and edges
     */
    this.nodes = graphData.nodes || [];
    this.startNode = graphData.startNode;
    this.endNode = graphData.endNode;

    // FLATTEN EDGES: Bellman-Ford likes a simple list of edges, not an Adjacency List.
    // We convert the graphData.edges array directly into a format we can loop over easily.
    this.edges = [];
    if (graphData.edges) {
      graphData.edges.forEach((edge) => {
        this.edges.push({
          from: edge.from,
          to: edge.to,
          weight: Number(edge.weight),
        });
      });
    }
  }

  run(startNodeId = this.startNode, endNodeId = this.endNode) {
    let logs = [];
    let V = this.nodes.length;
    let E = this.edges.length;

    // --- Data Structures ---
    let distances = new Map();
    let previous = new Map();

    this.nodes.forEach((node) => {
      distances.set(node.id, Infinity);
      previous.set(node.id, null);
    });

    if (!distances.has(startNodeId)) {
      logs.push(`Error: Start node ${startNodeId} not found.`);
      return { found: false, path: [], cost: 0, logs: logs };
    }
    logs.push(`Start Node: ${startNodeId}, End Node: ${endNodeId}`);

    distances.set(startNodeId, 0);
    logs.push(`Initialized start node [${startNodeId}] with distance 0`);

    // --- 1. Main Relaxation Loop (V-1 times) ---
    // We run this loop to propagate shortest paths
    let changed = false;
    for (let i = 0; i < V - 1; i++) {
      changed = false;
      for (let edge of this.edges) {
        let u = edge.from;
        let v = edge.to;
        let w = edge.weight;

        if (
          distances.get(u) !== Infinity &&
          distances.get(v) > distances.get(u) + w
        ) {
          let newDist = distances.get(u) + w;
          distances.set(v, newDist);
          previous.set(v, u);
          changed = true;
          // Only logging distinct updates to keep logs clean
          logs.push(`Iter ${i}: Updated [${v}] to cost ${newDist} via [${u}]`);
        }
      }
      // Optimization: If nothing changed, we are done early
      if (!changed) {
        logs.push(
          `Optimization: No updates in iteration ${i}. Stopping early.`
        );
        break;
      }
    }

    // --- 2. Negative Cycle Detection (Run once AFTER the loop) ---
    for (let edge of this.edges) {
      let u = edge.from;
      let v = edge.to;
      let w = edge.weight;

      if (
        distances.get(u) !== Infinity &&
        distances.get(v) > distances.get(u) + w
      ) {
        logs.push(
          `CRITICAL: Negative Cycle Detected involving edge ${u} -> ${v}!`
        );
        return {
          found: false,
          cost: Infinity,
          path: [],
          logs: logs,
          error: "Negative Cycle Detected",
        };
      }
    }

    // --- 3. Path Reconstruction ---
    if (distances.get(endNodeId) === Infinity) {
      logs.push(`Target [${endNodeId}] is unreachable.`);
      return { found: false, cost: Infinity, path: [], logs: logs };
    }

    let path = [];
    let current = endNodeId;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }

    logs.push(
      `Path found: ${path.join(" -> ")} with cost ${distances.get(endNodeId)}`
    );

    return {
      found: true,
      cost: distances.get(endNodeId),
      path: path,
      logs: logs,
    };
  }
}
