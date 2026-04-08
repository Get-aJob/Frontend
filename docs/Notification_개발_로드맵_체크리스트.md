# Notification 기능 개발 로드맵 · 체크리스트

> 근거 문서: `docs/알림_기능_기획서_초안.md`, `docs/Notification_페이지_기능_및_백엔드_연동_가이드.md`  
> 구현 중심 파일: `src/view/Notification.tsx` (및 `src/components/notification/*`, `src/api/Notification.ts`, `src/socket/`, 스토어·레이아웃)

## 상태 표기

| 표기 | 의미 |
|------|------|
| ✅ | 완료(또는 문서 작성 시점에 이미 충족된 항목) |
| ❌ | 미완료 — 구현 후 `✅`로 바꿔 가며 관리 |

**진행 상황은 이 표만 수정해도 됩니다.**

---

## 우선순위 개요

| 단계 | 이름 | 목표 |
|------|------|------|
| **P0** | 계약·API 뼈대 | 백엔드와 필드·URL·에러 형식 고정, `api` 모듈 추가 |
| **P1** | 목록 연동 | 목업 제거(또는 폴백), 로딩·에러·재시도, 첫 페이지 조회 |
| **P2** | 읽음 연동 | 단건·일괄 읽음 API, 서버와 UI 일치, 실패 롤백 |
| **P3** | 실시간·미읽음 | `notification:new` 반영, 미읽음 개수·배너·배지와 동기화 |
| **P4** | 안정화·확장 | 페이지네이션, 재연결, 다탭, 가드·정책·QA |

아래 표의 **순번**은 권장 **개발 순서**(의존성 기준)입니다.

---

## 체크리스트 (순서대로)

### P0 — 계약 · 인프라

| 순번 | 우선순위 | 작업 | 상태 | 비고 |
|:----:|:--------:|------|:----:|------|
| 1 | P0 | 프론트–백 **알림 JSON 스키마** 확정 (`id`, `type`, `title`, `body`, `payload`, `createdAt`, `readAt` 등) | ✅ | `src/types/Notification.ts` (`INotification` / `INotificationItem` / `mapNotificationToItem`) |
| 2 | P0 | **목록 API** 경로·쿼리(`cursor`/`limit`/`unreadOnly`)·응답 형식 합의 | ✅ | `GET /notifications`, `IGetNotificationsQuery` / `IGetNotificationsResponse` |
| 3 | P0 | **미읽음 개수 API** 경로·응답 합의 | ✅ | `GET /notifications/unread-count`, `IGetUnreadCountResponse` |
| 4 | P0 | **단건 읽음**·**일괄 읽음** API 경로·메서드 합의 | ✅ | `PATCH /notifications/:id/read`, `POST /notifications/read-all` |
| 5 | P0 | **Socket.IO 이벤트명**·페이로드가 REST 단건과 동일한지 합의 (`notification:new` 등) | ✅ | `src/socket/events.ts`, `src/types/Notification.ts` (`ISocketServerToClientEvents`) |
| 6 | P0 | `src/api/Notification.ts` 생성 — `getNotifications`, `getUnreadCount`, `markRead`, `markAllRead` 등 **Axios 패턴**으로 구현 | ✅ | `fetchNotifications` / `fetchUnreadCount` / `fetchNotificationOnlyOne` / `fetchAllNotification` |
| 7 | P0 | API 응답 → 화면용 타입 **매핑 함수**(camelCase/snake_case 등) 정리 | ✅ | `mapNotificationToItem` |

### P1 — 알림 페이지 목록 연동

| 순번 | 우선순위 | 작업 | 상태 | 비고 |
|:----:|:--------:|------|:----:|------|
| 8 | P1 | `Notification.tsx`에서 **초기 목록을 서버에서 로드**(React Query 또는 `useEffect`+state) | ✅ | `fetchNotifications` + `useEffect` (`src/view/Notification.tsx`) |
| 9 | P1 | **로딩 UI**(스피너·스켈레톤) | ✅ | 초기 로딩 문구 블록 |
| 10 | P1 | **에러 UI** 및 **재시도** 버튼 | ✅ | `initialLoadError` + `loadInitialNotifications` 재호출 |
| 11 | P1 | 백엔드가 내려주는 `type` **ENUM**에 맞춰 아이콘·라벨 매핑(알 수 없는 타입 폴백) | ✅ | `src/components/notification/notificationMeta.tsx` (`typeIcon` / `typeLabel`, `default`) |
| 12 | P1 | `payload`의 **이동 URL 규칙**을 백엔드와 맞추고, 앱 내 `PATH`와 불일치 시 변환 | ❌ | `Notification.tsx`에서 `payload.href` 문자열만 `navigate` (백엔드가 앱 경로와 맞춰 내려줄 것) |
| 13 | P1 | 안내 문구에서 **“(목업 데이터)” 제거**, 실데이터 기준 카피로 정리 | ✅ | `NotificationHeader` 설명 문구 |

### P2 — 읽음 처리 연동

| 순번 | 우선순위 | 작업 | 상태 | 비고 |
|:----:|:--------:|------|:----:|------|
| 14 | P2 | **단건 읽음** 버튼 → API 호출 → 성공 시 목록·미읽음 수 반영 | ✅ | `fetchNotificationOnlyOne` → `mapNotificationToItem` 갱신 또는 목록 재조회 (`Notification.tsx` `markRead`) |
| 15 | P2 | API 실패 시 **이전 상태 롤백** 및 사용자 피드백(토스트 등) | ❌ | 실패 시 `alert`만; 낙관적 업데이트 없어 롤백 대상 없음·토스트 미도입 |
| 16 | P2 | **모두 읽음** → API 연동 및 UI 동기화 | ✅ | `fetchAllNotification` 후 `fetchNotifications`로 목록 재동기화 (`markAllRead`) |
| 17 | P2 | 정책 합의 시 **바로가기 클릭 시 자동 읽음** 처리 | ✅ | `handleRowNavigate`: 미읽음이면 `await markRead` 후 `navigate` |

### P3 — 미읽음 · 실시간(Socket.IO)

| 순번 | 우선순위 | 작업 | 상태 | 비고 |
|:----:|:--------:|------|:----:|------|
| 18 | P3 | **미읽음 개수**를 전역 상태(예: Zustand) 또는 React Query로 보관 | ✅ | `src/store/useNotificationStore.ts` 전역 `unreadCount` 관리 (커스텀 이벤트 없이 상태 기반) |
| 19 | P3 | 로그인 직후(또는 앱 초기) `getUnreadCount` 호출 후 **탑바/사이드바 배지** 반영 | ✅ | `Layout` 로그인 상태 `syncUnreadCount()` + `notification:new` 수신 시 `increaseUnreadCount()`로 배지 동기화 |
| 20 | P3 | 알림 페이지 상단 **미확인 배너**를 서버 `unreadCount`(또는 동일 소스)와 연동 | ❌ | 목록 `items`에서 계산한 미읽음 수; `fetchUnreadCount` API 미연동 |
| 21 | P3 | Socket **단일 연결** 위치 확정(Layout·Provider·훅) — 페이지 이탈 시에도 정책에 맞게 유지/해제 | ❌ | 기획서 §5.2 |
| 22 | P3 | `notification:new`(실제 이벤트명에 맞게) 수신 시 **목록 상단 merge** + 미읽음 수 증가 | ❌ | 중복 `id` 방지 |
| 23 | P3 | **로그아웃 시** 소켓 `disconnect` 및 알림 관련 전역 상태 초기화 | ❌ | |
| 24 | P3 | 개발용 `ping`/`pong` 스모크 테스트 코드를 **프로덕션 경로에서 분리**(환경 변수 또는 제거) | ❌ | `src/hooks/useSocket.ts` 등 스모크 사용 시 분리 검토 |

### P4 — 확장 · 품질

| 순번 | 우선순위 | 작업 | 상태 | 비고 |
|:----:|:--------:|------|:----:|------|
| 25 | P4 | **커서 기반 무한 스크롤**(또는 페이지네이션)으로 과거 알림 로드 | ❌ | 기획서 MVP 이후 |
| 26 | P4 | **재연결** 지수 백오프·최대 재시도(백그라운드 탭 정책 선택) | ❌ | 기획서 §3·§5.2 |
| 27 | P4 | 재연결 후 **누락 알림 보정**( `since` / `lastId` 등) — 백엔드 스펙 있을 때 | ❌ | 선택 |
| 28 | P4 | **다탭 동기화**: `BroadcastChannel` 또는 서버 `notification:read` 이벤트 | ❌ | 기획서 §5.4 |
| 29 | P4 | 비로그인 시 알림 진입 **리다이렉트/안내**를 `Layout`과 통일 | ❌ | 기획서 §5.5 |
| 30 | P4 | 토큰 만료 시 소켓 끊김 → **리프레시 후 재연결** 흐름 | ❌ | axios 인터셉터와 맞춤 |
| 31 | P4 | (선택) WS 불가 시 **폴링 폴백** | ❌ | 기획서 §7 |
| 32 | P4 | (선택) 배너 닫기 **localStorage 영속** | ❌ | 연동 가이드 §1.3 |
| 33 | P4 | 수동/E2E 시나리오: 로그인 → 목록 → 읽음 → 재진입 **서버 데이터 일치** 확인 | ❌ | 연동 가이드 §2.7 |

### 스크랩 · 지원 완료 → 알림 (도메인 연동)

> **목표:** 스크랩 페이지(`src/view/Scrap.tsx` → `ScrapCard` / `ApplyModal`)에서 **지원하기** 성공 시, 사용자 알림 목록에 **「지원되었습니다」** 류 알림이 나타나게 함.

| 순번 | 담당 | 작업 | 상태 | 비고 |
|:----:|------|------|:----:|------|
| 34 | 백엔드 | 지원(Apply) API 성공 시 **알림 레코드 생성** (`type`, `title`, `body`, `payload.href` 등 — 예: `APPLICATION`, 지원 현황으로 이동 `/status`) | ✅ | 백엔드 완료(지원하기 클릭 시 notification_logs 생성) |
| 35 | 백엔드 | (선택) 생성 직후 해당 사용자 Socket.IO **`notification:new`** 브로드캐스트 | ❌ | P3-22와 함께 적용 시 실시간 반영 |
| 36 | 프론트 | 지원 성공 후 **알림 UI 갱신**: (A) 소켓 수신으로 목록·배지 merge 또는 (B) `fetchNotifications` / `fetchUnreadCount` 재호출 | ❌ | `ApplyModal` 성공 콜백·`onApplySuccess` 체인에서 트리거; 전역 스토어/React Query 연동 시 P3-18·19와 맞춤 |
| 37 | 프론트·백 | 알림 `type`·`notificationMeta` 라벨/아이콘과 **지원 알림** 카피·`payload.href` (`PATH.STATUS` 등) 합의 | ❌ | 기존 `APPLICATION` 타입 매핑 재사용 가능 |

---

## 문서 작성 시점 기준으로 이미 해당하는 항목 (참고)

아래는 코드·사용자 확인을 바탕으로 한 **초기 추정**입니다. 팀에서 검토 후 위 표의 해당 행을 ✅로 옮겨 적어도 됩니다.

| 내용 | 상태 제안 |
|------|-----------|
| `/notification` 라우트 및 알림 페이지 **기본 UI**(헤더·리스트 컴포넌트 분리, 빈 상태, 서버 목록 연동) | ✅ |
| **Socket.IO로 백엔드 연결** 성공(인증·CORS 포함) | ✅ |
| `src/socket/SocketClient.ts` 등 연결 설정(`withCredentials` 등) | ✅ |

---

## 한 줄 요약

**권장 순서:** P0 계약·`api/Notification` → P1 목록·로딩·에러 → P2 읽음 API → P3 미읽음·실시간·전역 배지 → P4 페이지네이션·재연결·다탭·QA.

---

*문서 버전: 2.1*
