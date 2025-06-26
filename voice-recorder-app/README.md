# 음성 녹음 앱

React, TypeScript, Vite로 제작된 간단한 음성 녹음 웹 애플리케이션으로, 음성 녹음, 재생, 저장 기능을 제공합니다.

## 주요 기능

- 마이크로부터 오디오 녹음
- 녹음된 오디오 재생
- 로컬에 녹음 파일 저장
- 모던하고 반응형 UI

## 기술 스택

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [PNPM](https://pnpm.io/) (패키지 관리)

## 시작하기

### 사전 준비

- Node.js (권장 버전: v18 이상)
- PNPM (npm/yarn 사용 가능)

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

기본적으로 [http://localhost:5173](http://localhost:5173) 에서 앱을 확인할 수 있습니다.

### 프로덕션 빌드

```bash
pnpm build
```

### 프로덕션 빌드 미리보기

```bash
pnpm preview
```

## 프로젝트 구조

```
voice-recorder-app/
├── public/               # 정적 자산
├── src/                  # 소스 코드
│   ├── assets/           # 이미지 및 아이콘
│   ├── components/       # React 컴포넌트
│   │   └── VoiceRecorder.tsx
│   ├── App.tsx           # 메인 앱 컴포넌트
│   ├── main.tsx          # 엔트리 포인트
│   └── ...
├── index.html            # HTML 템플릿
├── package.json          # 프로젝트 메타데이터 및 스크립트
├── vite.config.ts        # Vite 설정
└── ...
```
