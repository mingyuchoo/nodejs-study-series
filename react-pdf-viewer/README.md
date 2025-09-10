# PDF 뷰어 웹 앱

React + TypeScript + Vite를 사용해서 만든 PDF 문서 뷰어 웹 애플리케이션입니다.

## 주요 기능

- **PDF 파일 업로드 및 표시** - 로컬 PDF 파일을 선택하여 뷰어에서 확인
- **텍스트 검색 및 하이라이팅** ⭐ **NEW**
  - 전체 PDF 문서에서 텍스트 검색
  - 검색된 단어 자동 하이라이팅 (노란색 배경)
  - 현재 선택된 검색 결과 강조 표시 (주황색 배경 + 애니메이션)
  - 검색 결과 간 네비게이션 (이전/다음 버튼)
  - 검색 결과 개수 표시 (예: 3/15)
  - Enter 키로 다음 결과, Shift+Enter로 이전 결과 이동
- **고급 페이지 네비게이션**
  - 이전/다음 버튼으로 페이지 이동
  - 직접 페이지 번호 입력으로 원하는 페이지로 바로 이동
  - PDF 로드 시 자동으로 지정된 페이지로 이동
  - 검색 결과에 따른 자동 페이지 이동
- **페이지 이동 기능**
  - 페이지 입력란에 원하는 페이지 번호 설정
  - PDF 로드 완료 시 자동으로 해당 페이지로 이동
  - 실시간 페이지 이동 버튼
- **반응형 디자인** - 모바일 및 데스크톱 환경 지원
- **텍스트 레이어 및 주석 레이어 지원** - PDF 내 텍스트 선택 및 주석 표시
- **에러 처리** - PDF 로드 실패 시 적절한 오류 메시지 표시

## 사용된 기술

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 및 개발 서버
- **react-pdf 10.1.0** - PDF 렌더링
- **pdfjs-dist 5.3.93** - PDF.js 라이브러리

## 최근 업데이트

### v1.1.0 - 텍스트 검색 기능 추가 ⭐
- **새로운 컴포넌트 추가**:
  - `SearchBar.tsx` - 검색 인터페이스
  - `HighlightLayer.tsx` - 텍스트 하이라이팅 시스템
- **주요 개선사항**:
  - 전체 PDF 문서 텍스트 검색 기능
  - 실시간 하이라이팅 및 네비게이션
  - 키보드 단축키 지원 (Enter, Shift+Enter)
  - 검색 결과 캐싱으로 성능 최적화
- **기술적 개선**:
  - TypeScript 컴파일 오류 수정
  - CSS 구문 오류 해결
  - 타입 안전성 향상

## 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 빌드된 앱 미리보기
pnpm preview
```

## 사용법

### 기본 사용법
1. 웹 앱을 실행합니다
2. "PDF 파일 선택" 버튼을 클릭해서 로컬 PDF 파일을 업로드합니다
3. PDF 뷰어 하단의 컨트롤을 사용해서 페이지를 탐색합니다

### 텍스트 검색 기능 ⭐
1. **검색 실행**:
   - PDF가 로드된 후 상단의 검색창에 찾고자 하는 텍스트를 입력
   - "검색" 버튼을 클릭하거나 Enter 키를 누름
   - 전체 PDF 문서에서 해당 텍스트를 검색하여 하이라이팅

2. **검색 결과 탐색**:
   - 검색 결과 개수가 "3/15" 형태로 표시됨 (현재 위치/전체 개수)
   - ↑ 버튼 또는 Shift+Enter: 이전 검색 결과로 이동
   - ↓ 버튼 또는 Enter: 다음 검색 결과로 이동
   - 검색 결과가 다른 페이지에 있으면 자동으로 해당 페이지로 이동

3. **하이라이팅**:
   - 모든 검색 결과: 노란색 배경으로 표시
   - 현재 선택된 결과: 주황색 배경 + 테두리 + 깜빡이는 애니메이션
   - "지우기" 버튼으로 검색 결과 초기화

### 페이지 이동 기능
1. **자동 페이지 이동**: 
   - "페이지" 입력란에 원하는 페이지 번호를 입력 (예: 5)
   - PDF 파일을 선택하면 자동으로 해당 페이지로 이동
2. **수동 페이지 이동**:
   - "페이지 이동" 버튼을 클릭하여 지정된 페이지로 이동
   - PDF 뷰어 하단의 페이지 입력란에서 직접 페이지 번호 변경
3. **네비게이션 버튼**: 이전/다음 버튼으로 순차적 페이지 이동

## 프로젝트 구조

```
src/
├── assets/
│   └── react.svg          # React 로고
├── components/
│   ├── PDFViewer.tsx      # PDF 뷰어 메인 컴포넌트
│   ├── PDFViewer.css      # PDF 뷰어 스타일
│   ├── SearchBar.tsx      # 검색 바 컴포넌트
│   ├── SearchBar.css      # 검색 바 스타일
│   └── HighlightLayer.tsx # 텍스트 하이라이팅 레이어
├── types/                 # TypeScript 타입 정의 (현재 비어있음)
├── App.tsx                # 메인 앱 컴포넌트
├── App.css                # 앱 전체 스타일
├── index.css              # 글로벌 스타일
├── main.tsx               # 앱 진입점
└── vite-env.d.ts          # Vite 환경 타입 정의

public/
└── pdfjs/
    └── pdf.worker.min.js  # PDF.js 워커 파일
```

## 문제 해결

### 빌드 오류 해결
프로젝트는 TypeScript 컴파일 오류 없이 빌드됩니다. 만약 빌드 오류가 발생한다면:

```bash
# 의존성 재설치
pnpm install

# 타입 체크
pnpm build
```

### 일반적인 문제들
- **PDF 로드 실패**: PDF.js 워커 파일이 `public/pdfjs/` 경로에 있는지 확인
- **검색 기능 작동 안함**: PDF가 완전히 로드된 후 검색 시도
- **하이라이팅 표시 안됨**: 브라우저 개발자 도구에서 CSS 오류 확인

### 성능 최적화
- 대용량 PDF 파일의 경우 검색 시 약간의 지연이 있을 수 있습니다
- 검색 결과는 자동으로 캐싱되어 재검색 시 빠른 응답을 제공합니다

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
