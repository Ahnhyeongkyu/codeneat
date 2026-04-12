# MARKETING_STATUS.md — CodeNeat

## 기본 정보
- 타입: 개발자 도구 (검증된 시장: CodeBeautify 월 2300만 방문)
- 도메인: codeneat.dev (DNS 활성화 필요)
- 현재 배포: codeneat-eta.vercel.app
- 현재 TIER: QUICK LAUNCH → FULL LAUNCH (검증된 시장)

## 초기 마케팅 완료 기준 (전부 ✅ 될 때까지 멈추지 마)

### 인프라 + 콘텐츠
- [x] A-1~A-7. 인프라 (DNS 제외)
- [ ] 커스텀 도메인 DNS 활성화 (🔴 CEO 액션)
- [x] pSEO 80페이지 생성 (8도구 × 10용도) ✅ 2026-04-13
- [x] 경쟁사 비교 페이지 2개 ✅ 2026-04-13 (CodeNeat vs CodeBeautify + Best Dev Tools 2026)
- [x] 블로그 18개 라이브
- [x] 교차 홍보 footer ✅ 2026-04-13 (Resources 칼럼 추가: Blog, Compare, Best Tools, Dev.to)
- [x] copy.md 작성 ✅ 2026-04-13 (Privacy-First 5섹션 카피)

### 검색엔진 (DNS 활성화 후)
- [ ] GSC 소유권 인증 (🔴 CEO: DNS 활성화 후)
- [x] Sitemap 업데이트 (pSEO 82페이지 포함) ✅ 2026-04-13
- [ ] Sitemap 제출 (🔴 CEO: GSC에서)
- [ ] 핵심 URL 인덱싱 요청 (🔴 CEO: GSC에서)
- [ ] Bing Webmaster 등록 (🔴 CEO: bing.com/webmasters)

### 채널 발행
- [ ] 디렉토리 5개 제출 (🔴 CEO: marketing/directories.md 텍스트 준비 완료)
- [ ] Twitter 런칭 트윗 1개 (🔴 CEO: marketing/twitter-launch.md 준비 완료)
- [ ] Dev.to 심층 아티클 1개 (🔴 CEO: marketing/devto-article.md 준비 완료)

### FULL LAUNCH 준비
- [x] PH Coming Soon + 런칭 텍스트 준비 ✅ 2026-04-13 (marketing/producthunt.md)
- [x] HN Show HN 텍스트 + 첫 댓글 준비 ✅ 2026-04-13 (marketing/hackernews.md)
- [x] Twitter 런칭 스레드 준비 ✅ 2026-04-13 (marketing/twitter-launch.md — 10트윗)
- [x] GitHub Awesome Lists PR 텍스트 준비 ✅ 2026-04-13 (marketing/awesome-list-pr.md)

### 욕구 리프레이밍
- [x] 랜딩 Hero: Privacy-First 강조 ✅ 2026-04-13
  - 빨간 경고: "Your code is being sent to external servers."
  - 초록 해결: "100% Client-Side Processing"
  - CTA: "Use Tools Privately"
  - 신뢰: "Open source · No sign-up · Works offline"

### 검증
- [ ] GA4 외부 트래픽 확인 (배포 후)
- [ ] GSC 인덱싱 확인 (Sitemap 제출 후)

## 초기 마케팅 완료: [ ] (날짜: )

## 생성된 마케팅 콘텐츠 (marketing/ 디렉토리)
| 파일 | 용도 | 상태 |
|------|------|------|
| copy.md | Privacy-First 5섹션 마케팅 카피 | ✅ 게시 대기 |
| twitter-launch.md | 런칭 트윗 1개 + 10트윗 스레드 | ✅ CEO 검수 후 게시 |
| hackernews.md | Show HN 포스트 + 첫 댓글 | ✅ CEO 검수 후 게시 |
| producthunt.md | Coming Soon + 런칭 텍스트 | ✅ CEO 검수 후 등록 |
| devto-article.md | 심층 아티클 (8도구 + Privacy-First) | ✅ CEO 검수 후 게시 |
| awesome-list-pr.md | Awesome List PR 템플릿 | ✅ CEO 검수 후 PR |
| directories.md | 5개 디렉토리 제출 텍스트 | ✅ CEO가 각 사이트에 등록 |

## CEO 직접 할 것 (순서대로)
1. **DNS 활성화** — Namecheap → Vercel CNAME
2. **GSC 소유권 인증** → Sitemap 제출 → 핵심 URL 5개 인덱싱 요청
3. **Bing Webmaster** 등록 (bing.com/webmasters)
4. **Twitter 트윗** 게시 (marketing/twitter-launch.md 참고)
5. **Dev.to 아티클** 게시 (marketing/devto-article.md 복사)
6. **디렉토리 5개** 등록 (marketing/directories.md 텍스트 복사)
7. **PH Coming Soon** 등록 (marketing/producthunt.md)
8. **HN Show HN** 게시 (marketing/hackernews.md)
9. **Twitter 스레드** 게시 (marketing/twitter-launch.md)
10. **Awesome List PR** 제출 (marketing/awesome-list-pr.md)

## 코드 변경 요약 (2026-04-13)
| 파일 | 변경 |
|------|------|
| messages/en.json | Hero 리프레이밍 (problem/title/subtitle/badge/cta/trust), Footer 키 추가 |
| app/[locale]/page.tsx | Hero 섹션: 빨간 경고 + 초록 배지 + trust line |
| components/layout/footer.tsx | Resources 칼럼 추가 (5열), Blog/Compare/BestTools/Dev.to 링크 |
| lib/pseo-data.ts | 80 pSEO + 2 비교 페이지 데이터 (NEW) |
| app/[locale]/[slug]/page.tsx | pSEO/비교 페이지 렌더러 (NEW) |
| app/sitemap.ts | pSEO 82페이지 사이트맵 추가 |

## 빌드 결과
- ✅ 577 정적 페이지 생성 (기존 167 + pSEO 410)
- ✅ 에러 없음

## Weekly Log
| 주차 | 날짜 | WAU | GSC 클릭 | GSC 노출 | 상위 키워드 | AdSense | 메모 |
|------|------|-----|---------|---------|-----------|---------|------|
| W1 | | | | | | | |
| W2 | | | | | | | |
| W4 | | | | | | | |
| W6 | | | | | | | DECIDE |
