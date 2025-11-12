import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, MessageSquare, FolderOpen, ChevronRight, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
                <Card className="relative overflow-hidden hover:border-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-primary/10 via-card to-card border-2">
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
                <Card className="relative overflow-hidden hover:border-chart-3 hover:shadow-2xl hover:shadow-chart-3/30 transition-all duration-300 cursor-pointer h-full bg-gradient-to-br from-chart-3/10 via-card to-card border-2">
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
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-r from-muted/30 to-transparent">
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
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/5 hover:border-accent/50 transition-all cursor-pointer group bg-gradient-to-r from-muted/20 to-transparent">
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
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-chart-2/5 hover:border-chart-2/50 transition-all cursor-pointer group bg-gradient-to-r from-muted/20 to-transparent">
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
