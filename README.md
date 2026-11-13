<div align="center">

# 🍚 BobHub

**"오늘 점심, 혼자 먹지 마세요."**
함께 밥 먹을 사람을 찾고, AI에게 맛집을 추천받는 소셜 다이닝 플랫폼 — Frontend

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/license-N%2FA-lightgrey)

[Backend Repo →](https://github.com/Design-Study-Group/BobHub)

</div>

---

## 📖 소개

**BobHub**는 같이 밥 먹을 사람(파티)을 모집·매칭하고, 실시간 채팅으로 약속을 조율하며, AI 챗봇에게 맛집을 추천받는 소셜 다이닝 서비스입니다.
이 저장소는 [BobHub 백엔드](https://github.com/Design-Study-Group/BobHub)와 통신하는 React 기반 프론트엔드입니다.

### ✨ 주요 기능

- 🔐 **Google OAuth 로그인** — `@react-oauth/google` 기반 소셜 로그인
- 🧭 **대시보드** — 진행 중인 파티, 추천 맛집 등을 한눈에 확인
- 👥 **파티 채팅** — STOMP/SockJS 기반 실시간 채팅 (`PartyChat`)
- 🤖 **AI 챗봇** — 메뉴 추천을 도와주는 챗봇 (`ChatBot`)
- 🍽️ **맛집 추천** — 식당 등록/조회 및 댓글 (`RestaurantRecommend`)
- 🎲 **내기 게임** — 더치페이 대신 룰렛 · 핀볼 · 사다리타기로 승부 (`BettingParty`)
- 🧾 **마이페이지** — 내 활동 내역, 참여 파티 관리 (`MyPage`)

---

## 🛠 기술 스택

| 영역 | 기술 |
|---|---|
| Core | React 18, React Router 7 |
| Build Tool | Vite 7 (`vite-plugin-svgr`로 SVG 컴포넌트화) |
| HTTP | Axios |
| Realtime | SockJS + StompJS (WebSocket 채팅) |
| Auth | `@react-oauth/google` (Google OAuth 2.0) |
| Monitoring | `@vercel/speed-insights` |
| Test | Vitest |
| Deploy | Vercel |

---

## 🗂 프로젝트 구조

```bash
src/
├── api/              # 도메인별 API 함수 (oauth, PartyChat, restaurantApi ...)
├── auth/             # OAuth 콜백 처리 (CallBack.jsx)
├── axios/            # axios 인스턴스 및 인터셉터 설정
├── components/       # 공용 컴포넌트 (Modal 등)
├── hooks/            # 커스텀 훅
├── pages/
│   ├── Header/            # 상단 네비게이션
│   ├── Login/             # 로그인
│   ├── Dashboard/         # 메인 대시보드
│   ├── PartyChat/         # 파티 실시간 채팅
│   ├── ChatBot/           # AI 챗봇
│   ├── RestaurantRecommend/ # 맛집 추천
│   ├── BettingParty/      # 룰렛 / 핀볼 / 사다리타기 내기 게임
│   └── MyPage/            # 마이페이지
├── styles/           # 전역 스타일
└── assets/           # 이미지, 아이콘(svg)
```

---

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 환경별 `.env` 파일이 필요합니다.

| 파일 | 용도 |
|---|---|
| `.env` | 공통 설정 (`VITE_GOOGLE_CLIENT_ID`) |
| `.env.development` | 개발 환경 (`VITE_API_URL`, `VITE_GOOGLE_REDIRECT_URI`) |
| `.env.production` | 프로덕션 환경 (`VITE_API_URL`, `VITE_GOOGLE_REDIRECT_URI`) |

> 개발 서버는 `/api`, `/ws` 요청을 `http://localhost:8080`(백엔드)으로 프록시합니다. 백엔드 서버를 먼저 실행해 주세요.

### 3. 실행

```bash
# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 테스트 실행
npm run test
```

---

## 🤝 협업 규칙

### 키워드 (작업 내용 분류)

| 태그     | 설명                                                    |
|----------|-----------------------------------------------------------|
| Feat     | 새로운 기능 추가                                         |
| Add      | 파일 추가                                                |
| Del      | 파일 삭제                                                |
| Fix      | 버그 수정                                                |
| Docs     | 문서 수정                                                |
| Style    | 스타일 변경, 세미콜론 누락 등 **코드 변경이 없는 경우**  |
| Test     | 테스트 코드 추가, 리팩토링된 테스트 코드                  |
| Chore    | 빌드 설정, 패키지 수정, 기타 작업                         |
| Refactor | 코드 리팩토링 (기능 변화 없이 구조 개선)                  |
| CI       | CI 설정 (예: GitHub Actions) 관련 작업                    |

### 브랜치 명명 규칙

```
[키워드]-[issue_number]
```

예시: 이슈 번호 3번에 대한 새로운 기능 개발 → `feat-3`

### 커밋 메시지 규칙

- 형식: `[키워드] 작업 내용`
- 예시: `Fix 소켓 연결 오류 수정`

**작성 규칙**
- 키워드 첫 글자는 **대문자**
- 키워드와 내용 사이는 **한 칸 띄어쓰기**
- **제목은 간결하게**

### PR 규칙

PR은 `.github/PULL_REQUEST_TEMPLATE.md` 양식(Key Changes / Issue / Branch / To Reviewers)에 맞춰 작성합니다.

---

<div align="center">

Made with 🍚 by **Design-Study-Group**

</div>
