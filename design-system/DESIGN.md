# VRINK Admin Design System

> weemiles.github.io/vrink-shop 어드민에 적용된 디자인 시스템.
> 깔끔하고 차분한 **B2B SaaS 대시보드** 스타일. 파란색 단일 포인트 + 라이트 그레이 배경.

---

## 핵심 인상 (한 줄 요약)

- **밝은 회색 배경 + 흰 카드** → 정보 위주, 눈 안 피로
- **파란색(#0095FF) 하나만 포인트** → 액션·활성 상태에만 사용
- **굵기는 Regular(400) / Medium(500)만** → Bold 안 씀, 차분한 위계
- **둥근 카드(20px) + 아주 옅은 그림자** → 떠 있는 느낌 살짝만

---

## 1. 컬러

### Primary (브랜드)
| 토큰 | HEX | 용도 |
|---|---|---|
| `--color-primary` | `#0095FF` | 버튼, 활성 메뉴, 링크, 포커스 |
| `--color-primary-dark` | `#0077CC` | primary 배지 텍스트 |
| `--color-primary-soft` | `#EFF6FF` | 활성 메뉴 배경 |
| `--color-primary-soft-2` | `#E6F4FF` | info / primary 배지 배경 |

### Surface & Background
| 토큰 | HEX | 용도 |
|---|---|---|
| `--color-bg` | `#F8F8FA` | 페이지 전체 배경 |
| `--color-surface` | `#FFFFFF` | 카드·사이드바·탑바 |
| `--color-hover` | `#F6F6F6` | 메뉴/항목 호버 |
| `--color-hover-2` | `#FAFAFA` | 테이블 행 호버 |

### Text (4단계 위계)
| 토큰 | HEX | 용도 |
|---|---|---|
| `--text-strong` | `#111111` | 제목, 본문 강조 |
| `--text-body` | `#505050` | 라벨, 일반 본문 |
| `--text-muted` | `#767676` | 캡션, 테이블 헤더 |
| `--text-faint` | `#A0A8B3` | 힌트, placeholder |

### Border
| 토큰 | HEX | 용도 |
|---|---|---|
| `--border` | `#EDF2F6` | 기본 테두리·구분선 |
| `--border-subtle` | `#F6F6F6` | 테이블 셀 구분선 |
| `--border-input` | `#E2E8F0` | 입력 필드 테두리 (1.5px) |

### Semantic (상태)
| 상태 | 텍스트 | 배경 |
|---|---|---|
| Success | `#00B377` | `#E6FBF4` |
| Warning | `#E0A830` | `#FEF6E6` |
| Error | `#D32F2F` | `#FDE8E8` |
| Danger(액션) | `#EC3D3D` | — (삭제·로그아웃) |

---

## 2. 타이포그래피

- **폰트**: Pretendard
- **굵기**: Regular(400), Medium(500) **두 단계만 사용** — Bold 금지가 규칙. `b/strong`도 500으로 강제.
- **line-height**: 1.2 (전역)

| 토큰 | px | 용도 |
|---|---|---|
| `--fs-title` | 24 | 페이지 타이틀 |
| `--fs-modal` | 18 | 모달 타이틀 |
| `--fs-lg` | 16 | 빈 상태 타이틀 |
| `--fs-md` | 14 | 네비게이션·기본 UI |
| `--fs-base` | 13 | 본문·테이블·버튼 |
| `--fs-sm` | 12 | 테이블 헤더·폼 라벨 |
| `--fs-xs` | 11 | 배지·힌트·섹션 타이틀 |

---

## 3. 모양 (Radius)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--r-xs` | 4px | 배지, 작은 버튼 |
| `--r-sm` | 6px | 버튼, 서브메뉴 |
| `--r-md` | 8px | 메뉴, 입력창, 탑바 버튼 |
| `--r-lg` | 14px | 알림 드롭다운 |
| `--r-xl` | 20px | **카드·모달·테이블** (시그니처) |
| `--r-full` | 9999px | 아바타, 둥근 배지, 토글 |

## 4. 그림자 (아주 옅게)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--shadow-card` | `0 4px 20px rgba(238,238,238,.5)` | 카드·테이블 (거의 안 보일 정도) |
| `--shadow-dropdown` | `0 4px 16px rgba(0,0,0,.08)` | 드롭다운 |
| `--shadow-pop` | `0 12px 40px rgba(0,0,0,.13)` | 알림 팝오버 |
| `--shadow-modal` | `0 24px 64px rgba(0,0,0,.18)` | 모달 |

---

## 5. 레이아웃

```
┌──────────┬──────────────────────────────┐
│ Sidebar  │ Topbar (64px)                │
│ 256px    ├──────────────────────────────┤
│          │ Page content (padding 28px)  │
│ 흰 배경   │ ┌── card / table-wrap ──┐    │
│          │ │  radius 20px           │    │
└──────────┴──────────────────────────────┘
```

| 토큰 | 값 |
|---|---|
| `--sidebar-w` | 256px |
| `--topbar-h` | 64px |
| `--page-pad` | 28px |

**간격 스케일**: 2, 4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 28 (4의 배수 중심)

---

## 6. 컴포넌트 클래스

| 클래스 | 설명 |
|---|---|
| `.btn` + `.btn-primary` / `.btn-outline` / `.btn-danger` / `.btn-sm` | 버튼 |
| `.badge` + `.badge-success` / `-warning` / `-error` / `-primary` | 상태 배지 |
| `.card` | 흰 카드 (radius 20, 옅은 그림자) |
| `.table-wrap` + `table/th/td` | 데이터 테이블 |
| `.form-group` / `.form-label` / `.form-input` / `.form-select` / `.form-textarea` | 폼 (입력창 높이 42px, 포커스 시 파란 테두리) |
| `.toggle-switch` | iOS 스타일 토글 |
| `.modal-overlay` / `.modal` / `.modal-header` / `.modal-body` / `.modal-footer` | 모달 |
| `.sidebar` / `.topbar` / `.page-content` / `.nav-item` | 레이아웃 |

---

## 7. 사용법

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="design-system/vrink-admin-ds.css">
</head>
<body>
  <button class="btn btn-primary">저장</button>
  <span class="badge badge-success">정상</span>
  <div class="card">카드 내용</div>
</body>
</html>
```

데모: `design-system/preview.html` 을 브라우저로 열어 전체 컴포넌트 확인.

---

## 적용 원칙 (이 시스템답게 쓰려면)

1. **파란색은 아껴 써라** — 활성/액션에만. 본문에 파란 글씨 X
2. **Bold 쓰지 마라** — 강조는 Medium(500) + 색 위계로
3. **그림자는 거의 안 보이게** — 카드는 떠 있는 게 아니라 살짝 구분만
4. **radius는 20px 카드 / 8px 인터랙션** 두 그룹으로
5. **테이블이 주인공** — 어드민이니 데이터 가독성 최우선 (th는 회색 배경 + muted 텍스트)
