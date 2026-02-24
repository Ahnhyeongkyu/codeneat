# CodeNeat — 개발자 도구 사이트

## 프로젝트 개요
- **사이트:** codeneat.dev
- **슬로건:** "Clean Up Your Code"
- **목적:** 전 세계 개발자용 무료 온라인 도구 (JSON Formatter, Base64, Regex 등)
- **차별화:** 모던 UI + 클라이언트 사이드 보안 + AI 기능
- **포지셔닝:** Privacy-First ("Your data never leaves your browser")

## 기술 스택
- **Framework:** Next.js 16+ (App Router, Turbopack)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4 (CSS-first) + shadcn/ui
- **i18n:** next-intl 4.x (EN 우선, KO/JA 추후)
- **배포:** Vercel
- **광고:** AdSense → Ezoic → Mediavine (단계적)
- **결제:** Lemon Squeezy (Pro $4.99/mo)

## 핵심 아키텍처 원칙
1. **100% 클라이언트 사이드 처리** — 도구 로직은 서버 전송 없음
2. **서버 요청은 오직:** AI 해석 (Pro), 광고 스크립트, GA4 이벤트
3. **Privacy-First** — 모든 페이지에 배지 표시
4. **Lazy Load** — 도구별 코드 스플리팅, 광고 지연 로드

## 디렉토리 구조
```
app/
  [locale]/              → i18n 라우팅 (en)
    page.tsx             → 홈페이지
    json-formatter/      → 도구 페이지들
    ...
  api/                   → AI, 라이선스 API
  layout.tsx             → 루트 레이아웃 (폰트, 메타데이터)
  robots.ts, sitemap.ts  → SEO
components/
  ui/                    → shadcn/ui 컴포넌트
  layout/                → Header, Footer, ThemeToggle, MobileNav
  tool-layout.tsx        → 도구 공통 레이아웃
  copy-button.tsx        → 복사 버튼
  privacy-badge.tsx      → Privacy-First 배지
i18n/                    → routing.ts, request.ts
lib/
  tools/                 → 도구별 순수 함수 (json.ts, base64.ts, ...)
  utils.ts               → cn() 유틸리티
messages/
  en.json                → 영어 번역
```

## MVP 도구 8개 (Sprint 1 — 변경 불가)
1. JSON Formatter/Viewer — 킬러 도구
2. Base64 Encode/Decode
3. URL Encode/Decode
4. Regex Tester
5. Diff Checker
6. JWT Decoder
7. SQL Formatter
8. Hash Generator (MD5/SHA)

## URL 구조
- `/json-formatter` `/base64-encode-decode` `/url-encode-decode`
- `/regex-tester` `/diff-checker` `/jwt-decoder`
- `/sql-formatter` `/hash-generator`

## Design Palette (CodeNeat 전용)

디자인 보편 규칙은 글로벌 Skill `design-guideline` 참조. 아래는 CodeNeat 전용 색상값.

```
Primary:     #059669 (Emerald 600)  → oklch(0.586 0.163 162) — CTA, 링크, 강조
  Dark mode: #34D399 (Emerald 400)  → oklch(0.765 0.177 163.223)
Accent:      #ECFDF5 (Emerald 50)  → oklch(0.979 0.021 166.113) — 보조 배경, 선택 항목
Secondary:   Slate 100 (neutral)    — secondary 버튼 전용, 무채색
Destructive: #DC2626 (Red 600)      → oklch(0.577 0.245 27.325) — 에러
Success:     Primary와 동일 (Emerald)
나머지:      흰색, Slate 계열만

Chart: Emerald → Cyan → Amber → Violet → Rose
Layout: max-w-6xl mx-auto (도구 페이지)
```

**절대 금지:** Violet, Blue 등 팔레트 외 색상 사용 (AI 기본 색 = "AI가 만든 티")

## 개발 규칙
- **스코프 크리프 금지:** MVP 8개 도구 외 추가 금지 (Sprint 2부터)
- **도구 로직은 lib/tools/에 순수 함수로** — UI와 분리
- **모든 텍스트는 messages/en.json에** — 하드코딩 금지
- **도구 페이지는 ToolLayout 컴포넌트 사용** — 일관된 구조
- **반응형 필수** — 모바일/태블릿/데스크톱
- **다크모드 필수** — .dark 클래스 기반

## SEO 필수 사항
- 각 도구 페이지: 고유 title, meta description, H1
- FAQ 섹션 + FAQPage JSON-LD
- BreadcrumbList JSON-LD
- canonical URL
- OG 이미지
- 내부 링크 3개 이상 (관련 도구)

## 현재 진행 상황
- Sprint 0: 인프라 세팅 완료
- Sprint 1: 도구 8개 개발 완료
- SEO: metadata + JSON-LD + OG Image 완료
- Analytics: GA4 + AdSense 셋업 완료
- 배포: Vercel 프로덕션 (codeneat-eta.vercel.app)
- GitHub: github.com/Ahnhyeongkyu/codeneat
- 도메인: codeneat.dev (DNS 설정 대기)
