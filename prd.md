# PRD: 1인용 오목 게임 (Codex CLI 프로젝트)

## 개요
* **프로젝트명**: Omok Solo (1인용 오목)
* **개발환경**: Node.js (Codex CLI 기반)
* **운영체제**: macOS
* **데이터베이스**: SQLite
* **목표**: macOS 콘솔에서 작동하는 1인용 오목 게임 개발 (AI 상대 플레이 지원)

## 주요 기능
| 구분 | 기능명           | 설명                                       |
| ---- | ---------------- | ------------------------------------------ |
| 1    | 게임 보드 렌더링 | 콘솔에서 15x15 크기의 오목판 표시          |
| 2    | 돌 두기 기능     | 플레이어가 좌표 입력으로 돌을 놓을 수 있음 |
| 3    | AI 상대 기능     | 간단한 Minimax 또는 랜덤 기반 AI 구현      |
| 4    | 승패 판정        | 5목(가로/세로/대각선) 달성 시 게임 종료    |
| 5    | SQLite 기록      | 게임 결과(날짜, 승/패, 소요 턴수) 저장     |
| 6    | 기록 조회        | 이전 경기 결과를 DB에서 조회 가능          |
| 7    | 설정 관리        | 보드 크기, AI 난이도 조정 옵션 지원        |

## 기술 스택
| 항목        | 기술                      |
| ----------- | ------------------------- |
| Language    | JavaScript (Node.js 20+)  |
| Framework   | Codex CLI                 |
| Database    | SQLite (better-sqlite3)   |
| OS          | macOS (Terminal 환경)     |
| CLI UI      | inquirer, chalk, figlet   |
| AI 알고리즘 | Minimax / Random Decision |

## 시스템 구조
```mermaid
flowchart LR
    A[사용자 입력] --> B[CLI 인터페이스 (Codex CLI)]
    B --> C[게임 엔진 (OmokEngine.js)]
    C --> D[AI 모듈 (AIPlayer.js)]
    C --> E[DB 모듈 (SQLiteManager.js)]
    E --> F[(SQLite DB)]
    C --> G[결과 출력]
```

## DB 스키마
```sql
CREATE TABLE IF NOT EXISTS game_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    result TEXT CHECK(result IN ('win','lose','draw')),
    moves INTEGER,
    duration INTEGER
);
```

## 주요 모듈 설계
| 모듈명            | 역할                                                      |
| ----------------- | --------------------------------------------------------- |
| index.js          | 엔트리 포인트, CLI 초기화 및 메뉴 출력                    |
| OmokEngine.js     | 게임 로직, 돌 배치, 승패 판정 담당                        |
| AIPlayer.js       | 간단한 AI 알고리즘 (난이도 조절)                          |
| SQLiteManager.js  | DB 연결, 기록 저장/조회 기능                              |
| config.json       | 게임 설정 (보드 크기, 난이도 등)                          |
| frontend/ (React) | React 기반 프론트엔드 UI, 보드 시각화 및 사용자 입력 처리 |

## 개발 일정
| 단계 | 작업 내용                                 | 예상 기간 |
| ---- | ----------------------------------------- | --------- |
| 1    | 프로젝트 구조 설계 및 CLI 초기 구현       | 1일       |
| 2    | 보드 및 돌 배치 로직 구현                 | 2일       |
| 3    | AI 로직 구현 (Random → Minimax)           | 3일       |
| 4    | SQLite 연동 및 기록 관리                  | 2일       |
| 5    | UX 개선 (색상, 메뉴, 리플레이 기능)       | 1일       |
| 6    | 테스트 및 GitHub push (내부용, 배포 없음) | 1일       |

## 실행 예시
```bash
$ codex omok
🎮 Omok Solo (1인용 오목)

1. 게임 시작
2. 이전 기록 보기
3. 설정 변경
4. 종료

> 1

플레이어 차례입니다. (x, y 좌표 입력 ex: 7 8)
> 7 8
```

## 향후 확장 계획
* Electron 기반 GUI 버전
* AI 학습 데이터 저장 기능 (자기 대국 학습)

## 참고
* Codex CLI 명령 템플릿: `codex create omok-cli --template=node`
* SQLite Wrapper: `better-sqlite3`
* CLI 스타일링: `chalk`, `figlet`, `inquirer`

