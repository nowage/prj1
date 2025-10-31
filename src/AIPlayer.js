class AIPlayer {
  constructor(level = 'random') {
    this.level = level;
  }

  chooseMove(engine) {
    if (this.level === 'minimax') {
      return this.chooseHeuristic(engine);
    }
    return this.chooseRandom(engine);
  }

  chooseRandom(engine) {
    const empties = [];
    const size = engine.size;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (engine.board[y][x] === 0) empties.push([x, y]);
      }
    }
    if (empties.length === 0) return null;
    const [x, y] = empties[Math.floor(Math.random() * empties.length)];
    return { x, y };
  }

  // Heuristic: 1) Win in one, 2) Block opponent's win, 3) Prefer center/near stones
  chooseHeuristic(engine) {
    const size = engine.size;

    // Try winning move
    const win = this.findImmediate(engine, 2);
    if (win) return win;

    // Block opponent
    const block = this.findImmediate(engine, 1);
    if (block) return block;

    // Prefer central positions or adjacency to existing stones
    const center = Math.floor(size / 2);
    let best = null;
    let bestScore = -Infinity;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (engine.board[y][x] !== 0) continue;
        const score = -Math.abs(x - center) - Math.abs(y - center) + this.adjacency(engine, x, y);
        if (score > bestScore) {
          bestScore = score;
          best = { x, y };
        }
      }
    }
    return best || this.chooseRandom(engine);
  }

  findImmediate(engine, player) {
    const size = engine.size;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (engine.board[y][x] !== 0) continue;
        // try move
        engine.board[y][x] = player;
        const won = engine.checkWinAt(x, y);
        engine.board[y][x] = 0;
        if (won) return { x, y };
      }
    }
    return null;
  }

  adjacency(engine, x, y) {
    // Count friendly/any stones around to favor clusters
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    let count = 0;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (engine.inBounds(nx, ny) && engine.board[ny][nx] !== 0) count += 0.2;
    }
    return count;
  }
}

module.exports = { AIPlayer };
