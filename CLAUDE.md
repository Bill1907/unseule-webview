# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**윤슬(Uneseule) 웹뷰** - Flutter 앱 내 웹뷰로 동작하는 아이 대상 AI 인형 서비스의 부모 모니터링 앱.

### 주요 기능
- 소셜 로그인 (OAuth + JWT)
- 인형 디바이스 연결 (블루투스)
- 디바이스 등록 및 WiFi 설정
- 대화 내역 모니터링
- 아이 성향 리포트

## Commands

```bash
bun dev            # 개발 서버 시작
bun build          # TypeScript 체크 후 프로덕션 빌드
bun lint           # ESLint 실행
bun preview        # 빌드 결과물 프리뷰
bun codegen        # GraphQL 타입 생성
bun codegen:watch  # GraphQL 타입 생성 (watch 모드)
```

## Architecture

React 19 + TypeScript + Vite 기반 모바일 웹뷰.

### 기술 스택
- **라우팅**: TanStack Router (파일 기반)
- **데이터 페칭**: TanStack Query + GraphQL (graphql-request)
- **상태관리**: Zustand
- **UI**: shadcn/ui (base-nova) + Tailwind CSS v4
- **Flutter 통신**: JavaScript Channel

### 디렉토리 구조
```
src/
├── lib/
│   ├── graphql/client.ts    # GraphQL 클라이언트
│   ├── flutter/bridge.ts    # Flutter 통신 브릿지
│   └── query-client.ts      # TanStack Query 설정
├── stores/                   # Zustand 스토어
│   ├── auth.store.ts
│   ├── device.store.ts
│   └── bluetooth.store.ts
├── hooks/                    # 커스텀 훅
├── routes/                   # 파일 기반 라우트
├── components/ui/            # shadcn/ui 컴포넌트
├── types/                    # 타입 정의
└── generated/                # GraphQL Codegen 결과
```

### Flutter Bridge 사용법
```typescript
import { flutter } from "@/lib/flutter/bridge";

// 블루투스 스캔
flutter.bluetooth.startScan();

// WiFi 설정 전달
flutter.wifi.configure({ ssid: "...", password: "..." });

// 소셜 로그인 요청
flutter.auth.requestSocialLogin("google");
```

### GraphQL API
- **Endpoint**: `https://api.uneseule.me/graphql`
- 환경변수: `VITE_GRAPHQL_URL`
- 쿼리 작성 후 `bun codegen` 실행하여 타입 생성

### Path Alias
- `@/*` → `./src/*`
