# Supabase 설정 가이드

## 1. Email Confirmation 비활성화
1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택
3. Authentication → Providers → Email
4. **Confirm email** 토글 OFF
5. Save 클릭

## 2. 데이터베이스 스키마 생성
1. SQL Editor 클릭
2. New Query
3. schema.sql 파일 내용 복사 붙여넣기
4. Run 클릭

## 3. 테스트 계정 생성
### 방법 1: 대시보드에서 직접 생성 (추천)
1. Authentication → Users
2. Add user 클릭
3. Email: test@test.com
4. Password: 123123
5. **Auto Confirm User** 체크 ✅
6. Create user 클릭

### 방법 2: 회원가입 페이지 사용
1. http://localhost:3003/signup 접속
2. 회원가입
3. Supabase 대시보드에서 해당 계정 찾기
4. ... 메뉴 → Confirm user

## 4. 로그인 테스트
- Email: test@test.com
- Password: 123123
