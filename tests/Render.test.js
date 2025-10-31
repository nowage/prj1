const { OmokEngine } = require('../src/OmokEngine');
const { renderBoard } = require('../src/render');

test('render includes axes and last move highlight', () => {
  const e = new OmokEngine(5);
  e.placeStone(2, 1, 1);
  const out1 = renderBoard(e);
  expect(out1).toMatch(/\b0\s+1\s+2\s+3\s+4/); // header axis
  expect(out1).toMatch(/1\s+\.\s+\.\s+X/); // last move capitalized in row 1
  e.placeStone(3, 1, 2);
  const out2 = renderBoard(e);
  expect(out2).toMatch(/1\s+\.\s+\.\s+x\s+O/); // previous x now lowercase, last is O
});

