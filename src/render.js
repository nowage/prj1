function renderBoard(engine) {
  const size = engine.size;
  const last = engine.getLastMove();
  const header = '   ' + Array.from({ length: size }, (_, x) => x.toString().padStart(2, ' ')).join(' ');
  const lines = [header];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const v = engine.board[y][x];
      let ch = '.';
      if (v === 1) ch = 'x';
      else if (v === 2) ch = 'o';
      if (last && last.x === x && last.y === y) ch = ch.toUpperCase();
      row.push(ch.padStart(2, ' '));
    }
    lines.push(y.toString().padStart(2, ' ') + ' ' + row.join(' '));
  }
  return lines.join('\n');
}

module.exports = { renderBoard };

