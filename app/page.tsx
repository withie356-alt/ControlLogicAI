"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Zap, Settings, Activity, BarChart3, Search, FolderOpen, ChevronRight, Clock, TrendingUp } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Badge } from "@/components/ui/badge"
import { CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState<any>(null)

  // 이미 로그인된 사용자 체크 및 실시간 상태 구독
  useEffect(() => {
    const supabase = createClient()

    // 초기 사용자 상태 확인
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setChecking(false)
    })

    // 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }

    // 실시간 auth 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setChecking(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)

      // 로그인 정보 저장
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      router.push("/")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "로그인에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    )
  }

  // 로그인된 사용자를 위한 홈 화면
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <AppHeader />

        <main className="container mx-auto px-6 py-4 max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="h-full flex flex-col gap-3">
            {/* Hero Section - Minimal */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h1 className="text-2xl font-bold">위드인천에너지 제어로직 AI 분석 플랫폼</h1>
                <p className="text-muted-foreground text-xs mt-0.5">미소 AI 기반 제어로직 분석으로 운영 효율성을 높이세요</p>
              </div>
            </div>

            {/* Main Action Buttons - Large */}
            <div className="flex-none">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Signal Search Button */}
                <Link href="/search" className="group">
                  <Card className="relative overflow-hidden hover:border-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-primary/10 via-card to-card border-2 active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                    <CardHeader className="relative p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-primary/30">
                          <Search className="h-8 w-8 text-white" />
                        </div>
                        <ChevronRight className="h-8 w-8 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                      <CardTitle className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">신호 검색 및 분석</CardTitle>
                      <CardDescription className="text-base">제어 및 계측 신호를 검색하고 단계별 워크플로우로 상세 분석을 시작하세요</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                {/* Reports Button */}
                <Link href="/reports" className="group">
                  <Card className="relative overflow-hidden hover:border-chart-3 hover:shadow-2xl hover:shadow-chart-3/30 transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-chart-3/10 via-card to-card border-2 active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-chart-3/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                    <CardHeader className="relative p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-3 to-chart-3/80 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-chart-3/30">
                          <FolderOpen className="h-8 w-8 text-white" />
                        </div>
                        <ChevronRight className="h-8 w-8 text-muted-foreground group-hover:text-chart-3 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                      <CardTitle className="text-3xl font-bold mb-2 group-hover:text-chart-3 transition-colors">분석 리포트</CardTitle>
                      <CardDescription className="text-base">완료된 분석 결과를 확인하고 상세 리포트 및 PDF를 생성하세요</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </div>

          {/* Recent Analysis & Stats */}
          <div className="flex-1 grid gap-4 lg:grid-cols-3 min-h-0">
            {/* Recent Analysis */}
            <Card className="lg:col-span-2 border-border/50 bg-gradient-to-br from-card via-card to-card/80 flex flex-col min-h-0">
              <CardHeader className="flex-none border-b border-border/50 pb-2 px-4 pt-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  최근 분석 프로젝트
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">진행 중이거나 최근 완료된 분석</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-2 px-4 pb-4 overflow-y-auto">
                <div className="space-y-3">
                  <Link href="/analysis/FCZ5202A">
                    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-r from-muted/30 to-transparent active:scale-95">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">FCZ5202A 댐퍼 제어</p>
                          <Badge variant="outline" className="text-xs border-primary/50 text-primary flex-shrink-0">진행중</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">PID 파라미터 튜닝 분석</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                    </div>
                  </Link>

                  <Link href="/analysis/TRIP_DH_P01">
                    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/5 hover:border-accent/50 transition-all cursor-pointer group bg-gradient-to-r from-muted/20 to-transparent active:scale-95">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm group-hover:text-accent transition-colors truncate">DH 순환펌프 TRIP</p>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">완료</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">TRIP 조건 분석</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                    </div>
                  </Link>

                  <Link href="/analysis/TI5201A">
                    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-chart-2/5 hover:border-chart-2/50 transition-all cursor-pointer group bg-gradient-to-r from-muted/20 to-transparent active:scale-95">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm group-hover:text-chart-2 transition-colors truncate">TI5201A 온도 제어</p>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">완료</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">2차 과열기 온도 제어 분석</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-chart-2 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50 bg-gradient-to-br from-card via-card to-muted/20 flex flex-col min-h-0">
              <CardHeader className="flex-none border-b border-border/50 pb-2 px-4 pt-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-1.5 rounded-lg bg-chart-2/10">
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                  </div>
                  이번 달 통계
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">현재까지의 분석 현황</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-2 px-4 pb-4 space-y-3 overflow-y-auto">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">진행 중인 분석</span>
                    <span className="text-xl font-bold text-orange-500">3</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-500/80 w-1/4 rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">완료된 분석</span>
                    <span className="text-xl font-bold text-primary">12</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/80 w-3/4 rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">생성된 리포트</span>
                    <span className="text-xl font-bold text-accent">8</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-accent to-accent/80 w-2/3 rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">AI 대화 세션</span>
                    <span className="text-xl font-bold text-chart-2">25</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-chart-2 to-chart-2/80 w-5/6 rounded-full shadow-sm"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      </div>
    )
  }

  // 로그인 안 된 사용자를 위한 로그인 화면
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating Icons (representing DCS/Plant) */}
        <div className="absolute top-1/4 left-1/4 text-white/5 animate-float">
          <Settings className="w-32 h-32" />
        </div>
        <div className="absolute top-1/3 right-1/4 text-white/5 animate-float-delayed">
          <Activity className="w-40 h-40" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-white/5 animate-float-slow">
          <BarChart3 className="w-36 h-36" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-white/5 animate-float">
          <Zap className="w-28 h-28" />
        </div>
      </div>

      {/* Logo Corners */}
      <div className="absolute top-8 left-8 z-20">
        <Image
          src="/gs-logo.svg"
          alt="GS"
          width={100}
          height={50}
          className="object-contain opacity-90"
        />
      </div>
      <div className="absolute top-8 right-8 z-20">
        <Image
          src="/52g_logo.svg"
          alt="52G"
          width={100}
          height={50}
          className="object-contain opacity-90"
        />
      </div>

      {/* Main Login Card - Center */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl animate-scale-in">
          <CardHeader className="space-y-3 pb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl p-4">
                  <Image
                    src="/logo.png"
                    alt="위드인천에너지"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-white">
              위드인천에너지
            </CardTitle>
            <p className="text-center text-purple-200 text-sm font-medium">
              ControlLogic AI Platform
            </p>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-purple-400 transition-all"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                  className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer text-purple-200"
                >
                  로그인 정보 저장
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 active:from-purple-700 active:to-blue-700 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-white/40 text-sm">
          © 2025 위드인천에너지. Powered by AI Technology
        </p>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: particle-float linear infinite;
        }

        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 15s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
          animation-delay: 2s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
