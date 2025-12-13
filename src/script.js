let uploadedGraphData = null;
let myDijkstraInstance = null;

const fileInput = document.getElementById("upload-btn");
const uploadText = document.getElementById("upload-text");
const runBtn = document.getElementById("run-btn");
const logOutput = document.getElementById("log-display");

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
        logOutput.textContent = "> Map loaded. Ready to run.";
      } catch (error) {
        console.error("Error parsing JSON:", error);
        uploadText.textContent = "Error: Invalid JSON file.";
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
    alert(
      "Please upload a valid graph JSON file before running the algorithm."
    );
    return;
  } else {
    console.log(event);
    myDijkstraInstance = new Dijkstra(uploadedGraphData);
    console.log("Dijkstra instance created:", myDijkstraInstance);
    const result = myDijkstraInstance.run();
    const logs = result.logs.join("\n");
    const path = result.path.join(" -> ");
    const cost = result.cost;
    logOutput.textContent = `> Running Dijkstra's Algorithm...\nDijkstra's Algorithm Logs:\n${logs}\n\nShortest Path: ${path}\nTotal Cost: ${cost}`;
  }
});
