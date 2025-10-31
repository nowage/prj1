class OmokEngine {
  constructor(boardSize = 15) {
    this.size = boardSize;
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.winner = 0; // 0 none, 1 player, 2 ai
    this.moves = 0;
    this.history = []; // {x,y,player}
  }

  getBoard() {
    return this.board.map((row) => row.slice());
  }

  inBounds(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  isValidMove(x, y) {
    return this.inBounds(x, y) && this.board[y][x] === 0 && this.winner === 0;
  }

  placeStone(x, y, player) {
    if (player !== 1 && player !== 2) return false;
    if (!this.isValidMove(x, y)) return false;
    this.board[y][x] = player;
    this.moves += 1;
    this.history.push({ x, y, player });
    if (this.checkWinAt(x, y)) this.winner = player;
    return true;
  }

  checkWinAt(x, y) {
    const target = this.board[y][x];
    if (!target) return false;
    const dirs = [
      [1, 0], // horizontal
      [0, 1], // vertical
      [1, 1], // diag down-right
      [1, -1], // diag up-right
    ];
    for (const [dx, dy] of dirs) {
      let count = 1;
      // forward
      let nx = x + dx;
      let ny = y + dy;
      while (this.inBounds(nx, ny) && this.board[ny][nx] === target) {
        count += 1;
        nx += dx;
        ny += dy;
      }
      // backward
      nx = x - dx;
      ny = y - dy;
      while (this.inBounds(nx, ny) && this.board[ny][nx] === target) {
        count += 1;
        nx -= dx;
        ny -= dy;
      }
      if (count >= 5) return true;
    }
    return false;
  }

  getLastMove() {
    return this.history.length ? this.history[this.history.length - 1] : null;
  }

  undo(steps = 1) {
    let undone = 0;
    while (steps-- > 0 && this.history.length) {
      const last = this.history.pop();
      this.board[last.y][last.x] = 0;
      this.moves = Math.max(0, this.moves - 1);
      undone += 1;
    }
    if (undone > 0) {
      // Winner may change; recompute conservatively
      this.recomputeWinner();
    }
    return undone;
  }

  recomputeWinner() {
    this.winner = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] !== 0 && this.checkWinAt(x, y)) {
          this.winner = this.board[y][x];
          return this.winner;
        }
      }
    }
    return 0;
  }
}

module.exports = { OmokEngine };
