const readline = require('readline');
const config = require('./config.json');
const { SQLiteManager } = require('./SQLiteManager');
const { GameController } = require('./GameController');

function printMenu() {
  console.log('🎮 Omok Solo (1인용 오목)');
  console.log('1. 게임 시작');
  console.log('2. 이전 기록 보기');
  console.log('3. 설정 변경/저장');
  console.log('4. 종료');
}

async function main() {
  const db = new SQLiteManager(config.databasePath);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = (q) => new Promise((res) => rl.question(q, res));
  let running = true;

  while (running) {
    printMenu();
    const choice = await ask('> ');
    if (choice === '1') {
      const controller = new GameController(config, db, { ask, print: console.log });
      const res = await controller.run();
      console.log(`게임 종료: ${res.result}, 수: ${res.moves}, 시간: ${res.duration}s`);
    } else if (choice === '2') {
      const history = await db.getHistory();
      if (!history.length) console.log('기록이 없습니다.');
      history.slice(-10).forEach((h, i) => {
        console.log(`${i + 1}. ${h.date} — ${h.result} — ${h.moves}수`);
      });
    } else if (choice === '3') {
      console.log('현재 설정:', JSON.stringify(config, null, 2));
      const bs = await ask(`보드 크기(${config.boardSize}) 입력 (엔터=유지): `);
      if (bs.trim()) config.boardSize = Math.max(5, Math.min(25, Number(bs) || config.boardSize));
      const level = await ask(`AI 난이도 [random|minimax] (${config.aiLevel}) 입력 (엔터=유지): `);
      if (level.trim() && (level === 'random' || level === 'minimax')) config.aiLevel = level;
      // 저장
      const fs = require('fs');
      fs.writeFileSync(require('path').join(__dirname, 'config.json'), JSON.stringify(config, null, 2));
      console.log('설정을 저장했습니다.');
    } else if (choice === '4') {
      running = false;
    } else {
      console.log('메뉴 번호를 선택하세요.');
    }
  }

  rl.close();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
