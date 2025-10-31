# Repository Guidelines

## 프로젝트 구조 및 모듈 구성
- 루트: `prd.md`(제품 명세), `AGENTS.md`(기여 가이드).
- `src/`: 실행 코드 — `index.js`, `OmokEngine.js`, `AIPlayer.js`, `SQLiteManager.js`, `config.json`.
- `tests/`: `src/`를 미러링하는 단위/통합 테스트(예: `OmokEngine.test.js`).
- `scripts/`: 초기화, 시드, 린트, 릴리스 등 보조 스크립트.
- `data/`: SQLite 파일 보관(예: `data/omok.db`, gitignore 대상).
- 선택적 `docs/`, `frontend/`(향후 UI 확장).

예시:
```
src/
  index.js  OmokEngine.js  AIPlayer.js  SQLiteManager.js  config.json
tests/
  OmokEngine.test.js  AIPlayer.test.js
```

## 빌드·테스트·개발 명령어
- 설치: 로컬 `npm install`, CI `npm ci` (Node.js 20+).
- 실행: `npm run dev` 또는 `npm start` → CLI 시작(`node src/index.js`).
- 테스트: `npm test` → Jest 실행, 커버리지: `npm test -- --coverage`.
- 린트/포맷: `npm run lint` / `npm run format`(ESLint + Prettier).
- 빌드(선택): `npm run build` → 번들/배포 준비.

이 스크립트는 `package.json`에 정의하세요. `Makefile`이 있다면 `make <target>`은 얇은 래퍼로만 사용합니다.

## 코딩 스타일·네이밍 규칙
- 스타일: 공백 2칸, 가능한 곳 쉼표 후행(trailing commas), 작은따옴표, Prettier 기본값.
- 린팅: ESLint(`eslint:recommended`, `node` 환경). 자동수정: `npm run lint -- --fix`.
- 네이밍: 핵심 모듈 PascalCase(`OmokEngine.js`, `AIPlayer.js`), 함수/변수 camelCase, 상수 UPPER_SNAKE_CASE.
- 모듈: 가급적 named export 사용, 파일은 단일 책임 유지.

## 작업 관리(Tasks)
- 위치: 루트 `tasks.md`
- 표기 규칙: 완료는 `[v]`, 실패는 `[x]`, 미시작은 `[ ]`로 표시
- 예시:
  - `[v]` Node.js 스캐폴딩 완료
  - `[ ]` 보드 ASCII 렌더링 추가
  - `[x]` 특정 기능 롤백(이슈 링크 첨부)

## 테스트 지침
- 프레임워크: Jest. 테스트는 `tests/`에 두고 `src/` 구조를 미러링.
- 파일 규칙: `*.test.js`; 엔진(승리 판정), AI(차단/즉승), 저장소(DB 라운드트립) 포함.
- 커버리지: `OmokEngine`/`AIPlayer` 기준 ≥80% 권장. 커버리지: `npm test -- --coverage`.

## 커밋·PR 가이드라인
- 커밋: Conventional Commits 사용(`feat:`, `fix:`, `refactor:`, `test:`, `chore:`). 변경은 작고 원자적으로.
- PR: 명확한 설명, 연결된 이슈, CLI 스크린샷/로그, DB 변경 메모, 테스트 증거 포함. CI 그린 및 린트 통과 필수.

## 보안·설정 팁
- 설정: 실행 옵션은 `src/config.json`에서 관리(보드 크기, AI 난이도, DB 경로).
- DB: 기본 SQLite(`better-sqlite3`), 설치 실패 시 자동 JSON 폴백(`data/history.json`).
- macOS: 네이티브 모듈 문제 시 Xcode Command Line Tools 설치 후 재시도.
- 버전관리: DB/로그/커버리지/환경파일 커밋 금지(`.gitignore` 반영).
