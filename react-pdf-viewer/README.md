# PDF 뷰어 웹 앱

React + TypeScript + Vite를 사용해서 만든 PDF 문서 뷰어 웹 애플리케이션입니다.

## 주요 기능

- **PDF 파일 업로드 및 표시** - 로컬 PDF 파일을 선택하여 뷰어에서 확인
- **고급 페이지 네비게이션**
  - 이전/다음 버튼으로 페이지 이동
  - 직접 페이지 번호 입력으로 원하는 페이지로 바로 이동
  - PDF 로드 시 자동으로 지정된 페이지로 이동
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
├── components/
│   ├── PDFViewer.tsx      # PDF 뷰어 메인 컴포넌트
│   └── PDFViewer.css      # PDF 뷰어 스타일
├── App.tsx                # 메인 앱 컴포넌트
├── App.css                # 앱 전체 스타일
└── main.tsx               # 앱 진입점

public/
└── pdfjs/
    └── pdf.worker.min.js  # PDF.js 워커 파일
```

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
