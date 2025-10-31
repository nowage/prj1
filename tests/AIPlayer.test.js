const { OmokEngine } = require('../src/OmokEngine');
const { AIPlayer } = require('../src/AIPlayer');

test('AI picks a valid empty cell', () => {
  const e = new OmokEngine(5);
  const ai = new AIPlayer('random');
  const move = ai.chooseMove(e);
  expect(move).toBeTruthy();
  expect(e.isValidMove(move.x, move.y)).toBe(true);
});

test('AI blocks immediate opponent win (horizontal)', () => {
  const e = new OmokEngine(5);
  // Opponent (1) has 4 in a row at y=0, x=0..3
  e.placeStone(0, 0, 1);
  e.placeStone(1, 0, 1);
  e.placeStone(2, 0, 1);
  e.placeStone(3, 0, 1);
  const ai = new AIPlayer('minimax');
  const move = ai.chooseMove(e);
  expect(move).toEqual({ x: 4, y: 0 });
});

test('AI takes immediate winning move (vertical)', () => {
  const e = new OmokEngine(5);
  // AI (2) has 4 in a column at x=2, y=0..3
  e.placeStone(2, 0, 2);
  e.placeStone(2, 1, 2);
  e.placeStone(2, 2, 2);
  e.placeStone(2, 3, 2);
  const ai = new AIPlayer('minimax');
  const move = ai.chooseMove(e);
  expect(move).toEqual({ x: 2, y: 4 });
});
