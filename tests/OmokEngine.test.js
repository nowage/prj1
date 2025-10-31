const { OmokEngine } = require('../src/OmokEngine');

test('places stones and detects horizontal five', () => {
  const e = new OmokEngine(15);
  expect(e.placeStone(0, 0, 1)).toBe(true);
  expect(e.placeStone(1, 0, 1)).toBe(true);
  expect(e.placeStone(2, 0, 1)).toBe(true);
  expect(e.placeStone(3, 0, 1)).toBe(true);
  expect(e.winner).toBe(0);
  expect(e.placeStone(4, 0, 1)).toBe(true);
  expect(e.winner).toBe(1);
});

test('rejects invalid moves and out of bounds', () => {
  const e = new OmokEngine(15);
  expect(e.placeStone(0, 0, 1)).toBe(true);
  expect(e.placeStone(0, 0, 2)).toBe(false);
  expect(e.placeStone(-1, 0, 1)).toBe(false);
  expect(e.placeStone(15, 15, 1)).toBe(false);
});

