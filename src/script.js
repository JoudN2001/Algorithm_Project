let uploadedGraphData = null;
let myDijkstraInstance = null;

const fileInput = document.getElementById("upload-btn");
const uploadText = document.getElementById("upload-text");
const runBtn = document.getElementById("run-btn");
const logOutput = document.getElementById("log-display");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const infoBtn = document.getElementById("info");

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
  console.log(event);
  console.log("Selected file:", file);

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
        console.log("Parsed JSON data:", uploadedGraphData);
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

/* Set up the Dijkstra instance and run the algorithm on button click */
runBtn.addEventListener("click", function (event) {
  if (!uploadedGraphData) {
    logOutput.textContent = "> Error: No map data uploaded.";
    alert("Invalid Map File! Missing nodes or edges.");
    return;
  } else {
    console.log(event);
    myDijkstraInstance = new Dijkstra(uploadedGraphData);
    console.log("Dijkstra instance created:", myDijkstraInstance);
    console.log(myDijkstraInstance.adjacencyList);
    const result = myDijkstraInstance.run();
    const logs = result.logs.join("\n");
    const path = result.path.join(" ➝ ");
    const cost = result.cost;
    logOutput.textContent = `> Running Dijkstra's Algorithm...\n-------------------\nDijkstra's Algorithm Logs:\n${logs}\n-------------------\nShortest Path: ${path}\nTotal Cost: ${cost}`;
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
