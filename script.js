const rows = 10, cols = 10;
let grid = [];
let startNode = null, endNode = null;
let clickCount = 0; // first click = start, second = end

function createGrid() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";
  gridElement.style.gridTemplateColumns = `repeat(${cols}, 35px)`;

  grid = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${i}-${j}`;

      let node = { x: i, y: j, id: `${i}-${j}`, element: cell, isWall: false };
      cell.addEventListener("click", () => handleCellClick(node));
      row.push(node);
      gridElement.appendChild(cell);
    }
    grid.push(row);
  }

  // default start/end
  startNode = grid[0][0];
  endNode = grid[rows - 1][cols - 1];
  startNode.element.classList.add("start");
  endNode.element.classList.add("end");
}

function handleCellClick(node) {
  if (node === startNode || node === endNode) return;

  if (clickCount === 0) {
    startNode.element.classList.remove("start");
    startNode = node;
    node.isWall = false;
    node.element.classList.remove("wall");
    node.element.classList.add("start");
    clickCount++;
  } else if (clickCount === 1) {
    endNode.element.classList.remove("end");
    endNode = node;
    node.isWall = false;
    node.element.classList.remove("wall");
    node.element.classList.add("end");
    clickCount++;
  } else {
    toggleWall(node);
  }
}

function toggleWall(node) {
  if (node === startNode || node === endNode) return;
  node.isWall = !node.isWall;
  node.element.classList.toggle("wall");
}

function runDijkstra() {
  resetStates();
  drawPath(dijkstra(grid, startNode, endNode, rows, cols));
}

function runAStar() {
  resetStates();
  drawPath(aStar(grid, startNode, endNode, rows, cols));
}

function drawPath(path) {
  for (let node of path) {
    if (node !== startNode && node !== endNode) node.element.classList.add("path");
  }
}

function resetGrid() {
  createGrid();
  clickCount = 0;
}

function resetStates() {
  for (let row of grid) {
    for (let node of row) {
      node.element.classList.remove("visited", "path", "start", "end");
      if (node.isWall) node.element.classList.add("wall");
    }
  }
  if (startNode) startNode.element.classList.add("start");
  if (endNode) endNode.element.classList.add("end");
}

// Demo: vertical wall with a gap at (5,5)
function setupDemo() {
  resetGrid();
  for (let i = 0; i < rows - 1; i++) {
    if (i === 5) continue;
    let node = grid[i][5];
    node.isWall = true;
    node.element.classList.add("wall");
  }
}

createGrid();
