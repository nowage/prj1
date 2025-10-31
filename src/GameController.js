const { OmokEngine } = require('./OmokEngine');
const { AIPlayer } = require('./AIPlayer');
const { renderBoard } = require('./render');

class GameController {
  constructor(config, db, io) {
    this.config = config;
    this.db = db;
    this.io = io; // { ask: async (q)=>string, print: (s)=>void }
  }

  async run() {
    const engine = new OmokEngine(this.config.boardSize);
    const ai = new AIPlayer(this.config.aiLevel);
    let turn = 1;
    this.io.print(renderBoard(engine));
    this.io.print("도움말: 좌표 'x y', 'u'(되돌리기), 'q'(종료)");
    const start = Date.now();

    while (!engine.winner && engine.moves < engine.size * engine.size) {
      if (turn === 1) {
        const input = (await this.io.ask('플레이어 차례 (x y|u|q): ')).trim();
        if (input.toLowerCase() === 'q') break;
        if (input.toLowerCase() === 'u') {
          const undone = engine.undo(2); // undo both AI and player last moves if possible
          if (!undone) this.io.print('되돌릴 수 있는 수가 없습니다.');
          else this.io.print('마지막 수를 되돌렸습니다.');
          this.io.print(renderBoard(engine));
          continue;
        }
        const [xs, ys] = input.split(/\s+/);
        const x = Number(xs);
        const y = Number(ys);
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
          this.io.print('입력 형식: x y (정수)');
          continue;
        }
        if (!engine.inBounds(x, y)) {
          this.io.print(`좌표는 0~${engine.size - 1} 범위여야 합니다.`);
          continue;
        }
        if (!engine.placeStone(x, y, 1)) {
          this.io.print('해당 위치에 둘 수 없습니다.');
          continue;
        }
        this.io.print(renderBoard(engine));
        turn = 2;
      } else {
        const move = ai.chooseMove(engine);
        if (!move) break;
        engine.placeStone(move.x, move.y, 2);
        this.io.print(`AI: (${move.x}, ${move.y})`);
        this.io.print(renderBoard(engine));
        turn = 1;
      }
    }

    let result = 'draw';
    if (engine.winner === 1) result = 'win';
    else if (engine.winner === 2) result = 'lose';
    const duration = Math.floor((Date.now() - start) / 1000);
    await this.db.saveResult({ date: new Date().toISOString(), result, moves: engine.moves, duration });
    return { result, moves: engine.moves, duration };
  }
}

module.exports = { GameController };

