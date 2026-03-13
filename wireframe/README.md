# 와이어프레임 구조 분리

와이어프레임 구조분리하고 설명하는 페이지입니다.

## 📂 프로젝트 파일 구조 (Wireframe)

현재 프로젝트는 공통 컴포넌트(사이드바, 상단바)를 분리하여 유지보수성을 높인 구조로 설계되었습니다.

```
wireframe/
├── index.html                # 메인 진입점 (calendar.html로 리다이렉트)
├── components/               # 공통 UI 컴포넌트
│   └── common/
│       ├── Sidebar.html      # 좌측 네비게이션 사이드바 구조
│       ├── Sidebar.js        # 사이드바 동적 로드 및 활성 메뉴 제어 로직
│       ├── Topbar.html       # 상단바 구조 및 공고 등록 모달 포함
│       └── Topbar.js         # 상단바 동적 로드 및 모달 제어 로직
└── views/                    # 주요 페이지 레이아웃
    ├── calendar.html         # [메인] 일정 관리 캘린더 뷰
    ├── kanban.html           # [메인] 지원 현황 칸반 보드 및 리스트 뷰
    ├── jobboard.html         # [메인] 실시간 수집 전체 채용 공고 리스트
    ├── stats.html            # [메인] 지원 통계 및 전환율 퍼널 분석
    ├── scrap.html            # [관리] 관심 공고 스크랩 보드
    ├── resume.html           # [관리] 이력서 생성 및 PDF 문서 관리
    ├── noti.html             # [기타] 일정 마감 및 합격 알림 센터
    ├── settings.html         # [기타] 계정 프로필 및 알림 설정
    └── jobtracker-auth.html  # [인증] 로그인 및 회원가입 통합 페이지
```

## 👀 실제 프로젝트에 이렇게 적용하세요 (예시입니다.)

```
src/
├── assets/                 # 이미지, 아이콘 등 정적 자원
├── components/             # 컴포넌트 모음
│   ├── common/             # 공통 UI 컴포넌트
│   ├── calendar/           # Calendar 페이지 전용 컴포넌트
│   ├── kanban/             # Kanban 페이지 전용 컴포넌트
│   ├── jobboard/           # JobBoard 페이지 전용 컴포넌트
│   └── ...                 # 기타 페이지별 전용 컴포넌트 폴더
├── views/                  # 페이지 단위 컴포넌트 (폴더 없이 파일로 관리)
│   ├── Auth.tsx            # 로그인/회원가입 페이지
│   ├── Calendar.tsx        # 캘린더 메인 페이지
│   ├── Kanban.tsx          # 지원 현황 페이지
│   ├── JobBoard.tsx        # 전체 공고 페이지
│   ├── Stats.tsx           # 통계 분석 페이지
│   ├── Scrap.tsx           # 공고 스크랩 페이지
│   ├── Resume.tsx          # 이력서 관리 페이지
│   ├── Noti.tsx            # 알림 센터 페이지
│   └── Settings.tsx        # 계정 설정 페이지
├── hooks/                  # 커스텀 훅
├── contexts/               # 전역 상태 관리
├── utils/                  # 공통 유틸 함수
├── styles/                 # 글로벌 스타일
├── App.tsx                 # 라우팅 설정
└── main.tsx                # 엔트리 포인트
```

### 📂 실제 프로젝트 적용 가이드

#### 1. `components/`: 부품 제작소

- **`common/`**: `Sidebar`, `Topbar`, `Button`, `Modal` 등 서비스 전반에서 공통으로 사용되는 UI 부품을 만듭니다.
- **페이지별 폴더 (`calendar/`, `kanban/` 등)**: 특정 페이지에서만 사용하는 복잡한 요소들(예: 캘린더의 일정 카드, 지원 현황의 칸반 카드)을 독립된 컴포넌트로 분리하여 관리합니다.

#### 2. `views/`: 조립 및 완성 (페이지 구성)

- `components/`에서 만든 부품들을 가져와 하나의 완성된 화면을 조립합니다.
- 각 파일(`Auth.tsx`, `Calendar.tsx` 등)은 해당 메뉴의 메인 스크린 역할을 수행합니다.

#### 3. `App.jsx`: 내비게이션 설계 (라우팅)

- `react-router-dom`을 사용하여 사용자가 접속한 URL 주소에 따라 어떤 `view`를 보여줄지 결정합니다.
- 예: `/calendar`로 접속 시 `Calendar.tsx` 뷰를 렌더링하도록 경로를 설정합니다.

#### 4. `main.jsx`: 프로젝트의 뿌리 (진입점)

- React 앱을 실제 브라우저 DOM에 주입(Mount)하는 최상단 파일입니다.
- `App.jsx`를 감싸며 글로벌 스타일 적용, 전역 상태 관리(Context API), 외부 라이브러리 초기화 등을 설정합니다.
