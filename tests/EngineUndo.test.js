const { OmokEngine } = require('../src/OmokEngine');

test('undo reverts last moves and updates winner', () => {
  const e = new OmokEngine(10);
  // create a win
  e.placeStone(0, 0, 1);
  e.placeStone(1, 0, 1);
  e.placeStone(2, 0, 1);
  e.placeStone(3, 0, 1);
  e.placeStone(4, 0, 1);
  expect(e.winner).toBe(1);
  // undo last move
  e.undo(1);
  expect(e.winner).toBe(0);
  expect(e.board[0][4]).toBe(0);
});

