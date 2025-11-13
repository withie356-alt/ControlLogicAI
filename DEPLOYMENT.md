# 배포 가이드

## 환경변수 설정

배포 전에 다음 환경변수들을 설정해야 합니다.

### 필수 환경변수

#### 1. Supabase (인증 시스템)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**설정 방법:**
1. [Supabase](https://supabase.com) 계정 생성
2. 새 프로젝트 생성
3. Settings → API에서 URL과 anon key 복사
4. 배포 플랫폼의 환경변수에 추가

**선택사항:**
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
(서버 사이드에서 관리자 권한이 필요한 경우에만 사용)

#### 2. Miso AI (AI 채팅 기능)

```bash
MISO_API_URL=https://your-miso-api-url
MISO_API_KEY=your-miso-api-key
```

**설정 방법:**
1. Miso/Dify AI 플랫폼 계정 생성
2. API 키 발급
3. 배포 플랫폼의 환경변수에 추가

## Vercel 배포

### 1. Vercel CLI를 통한 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 2. 환경변수 설정 (Vercel Dashboard)

1. Vercel 대시보드에서 프로젝트 선택
2. Settings → Environment Variables
3. 위의 필수 환경변수들을 추가
4. Production, Preview, Development 환경 선택
5. Save

### 3. 환경변수 설정 (Vercel CLI)

```bash
# Production 환경변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add MISO_API_URL production
vercel env add MISO_API_KEY production

# Preview 환경변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add MISO_API_URL preview
vercel env add MISO_API_KEY preview
```

## 로컬 개발 환경 설정

### 1. 환경변수 파일 생성

```bash
# .env.example을 복사하여 .env.local 생성
cp .env.example .env.local
```

### 2. .env.local 파일 수정

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Miso AI Configuration
MISO_API_URL=https://your-miso-api-url
MISO_API_KEY=your-miso-api-key
```

### 3. 개발 서버 실행

```bash
npm install
npm run dev
```

## 환경변수 누락 시 동작

앱은 환경변수가 누락되어도 최소한의 기능으로 동작하도록 설계되었습니다:

- **Supabase 미설정**: 인증 없이 기본 UI만 표시
- **Miso API 미설정**: AI 채팅 기능 사용 불가, 에러 메시지 표시

## 트러블슈팅

### 1. MIDDLEWARE_INVOCATION_FAILED 에러

**원인:** Supabase 환경변수가 설정되지 않음

**해결:**
1. Vercel 대시보드에서 환경변수 확인
2. `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
3. 재배포

### 2. favicon.ico 404 에러

**해결:** 이미 수정됨 - `public/favicon.ico`와 `app/icon.png` 추가됨

### 3. AI 채팅이 작동하지 않음

**원인:** Miso API 환경변수가 설정되지 않음

**해결:**
1. `MISO_API_URL`과 `MISO_API_KEY` 설정 확인
2. API 엔드포인트가 올바른지 확인
3. API 키가 유효한지 확인

### 4. 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 체크
npm run lint
```

## 배포 체크리스트

- [ ] `.env.example`의 모든 환경변수 확인
- [ ] Vercel/배포 플랫폼에 환경변수 설정
- [ ] 로컬에서 프로덕션 빌드 테스트 (`npm run build`)
- [ ] Supabase 프로젝트 생성 및 설정
- [ ] Miso AI API 키 발급
- [ ] 배포 후 주요 기능 테스트:
  - [ ] 로그인/로그아웃
  - [ ] AI 채팅
  - [ ] 신호 분석
  - [ ] 리포트 생성

## 참고 링크

- [Next.js 환경변수 문서](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel 환경변수 설정](https://vercel.com/docs/projects/environment-variables)
- [Supabase 문서](https://supabase.com/docs)
