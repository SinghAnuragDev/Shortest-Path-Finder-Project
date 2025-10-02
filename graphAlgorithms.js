// Heuristic for A* (Manhattan distance)
function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(node, grid, rows, cols) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let neighbors = [];
  for (let [dx, dy] of dirs) {
    let nx = node.x + dx, ny = node.y + dy;
    if (nx >= 0 && ny >= 0 && nx < rows && ny < cols) {
      if (!grid[nx][ny].isWall) {
        neighbors.push(grid[nx][ny]);
      }
    }
  }
  return neighbors;
}

// Dijkstra’s Algorithm
function dijkstra(grid, start, end, rows, cols) {
  let dist = {};
  let prev = {};
  let pq = [];

  grid.flat().forEach(node => {
    dist[node.id] = Infinity;
    prev[node.id] = null;
  });

  dist[start.id] = 0;
  pq.push({ node: start, dist: 0 });

  while (pq.length) {
    pq.sort((a, b) => a.dist - b.dist);
    const { node } = pq.shift();

    if (node === end) break;

    for (let neighbor of getNeighbors(node, grid, rows, cols)) {
      let alt = dist[node.id] + 1;
      if (alt < dist[neighbor.id]) {
        dist[neighbor.id] = alt;
        prev[neighbor.id] = node;
        pq.push({ node: neighbor, dist: alt });
      }
    }

    if (node !== start && node !== end) node.element.classList.add("visited");
  }

  let path = [];
  let cur = end;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur.id];
  }
  return path;
}

// A* Algorithm
function aStar(grid, start, end, rows, cols) {
  let g = {}, f = {}, prev = {}, openSet = [];

  grid.flat().forEach(node => {
    g[node.id] = Infinity;
    f[node.id] = Infinity;
    prev[node.id] = null;
  });

  g[start.id] = 0;
  f[start.id] = heuristic(start, end);
  openSet.push({ node: start, f: f[start.id] });

  while (openSet.length) {
    openSet.sort((a, b) => a.f - b.f);
    const { node } = openSet.shift();

    if (node === end) break;

    for (let neighbor of getNeighbors(node, grid, rows, cols)) {
      let tentative_g = g[node.id] + 1;
      if (tentative_g < g[neighbor.id]) {
        g[neighbor.id] = tentative_g;
        f[neighbor.id] = g[neighbor.id] + heuristic(neighbor, end);
        prev[neighbor.id] = node;
        openSet.push({ node: neighbor, f: f[neighbor.id] });
      }
    }

    if (node !== start && node !== end) node.element.classList.add("visited");
  }

  let path = [];
  let cur = end;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur.id];
  }
  return path;
}
