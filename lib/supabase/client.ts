import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 환경변수가 없을 때 더미 클라이언트 생성 (인증 기능은 비활성화됨)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. Authentication features will be disabled.')

    // 더미 URL과 키로 클라이언트 생성 (실제 API 호출은 실패하지만 앱은 크래시되지 않음)
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
