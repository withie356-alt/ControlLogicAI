"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Loader2, Send, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ImprovementPage() {
  const [description, setDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!description.trim()) return

    setIsAnalyzing(true)

    // TODO: AI API 호출
    // 임시 응답
    setTimeout(() => {
      setAnalysisResult({
        summary: "분석을 시작합니다...",
        searchResults: [
          "관련 문서 검색 중...",
          "제어 로직 분석 중...",
          "개선안 도출 중...",
        ],
        nextSteps: "분석 보고서를 생성합니다"
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">
      <AppHeader />
      <main className="container mx-auto px-6 py-6 flex-1 min-h-0 flex flex-col">
        {/* Header */}
        <div className="mb-6 flex-none">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Lightbulb className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">신호 분석 및 개선</h1>
              <p className="text-muted-foreground text-sm">
                AI 기반 제어 로직 최적화
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Input Section */}
          <div className="flex flex-col gap-3 min-h-0">
            <Card className="flex-1 min-h-0 flex flex-col">
              <CardHeader className="flex-none pb-3">
                <CardTitle className="text-lg">개선 설명</CardTitle>
                <CardDescription>
                  현재 상황, 문제점, 개선하고 싶은 방향 등을 상세히 작성하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 flex flex-col gap-3 pt-0">
                <Textarea
                  placeholder={`예시:

현재 FCZ5202A 댐퍼 제어가 불안정합니다.
PID 파라미터가 적절하지 않아 오버슈팅이 발생하고 있으며,
응답 속도도 느린 상황입니다.

제어 안정성을 높이고 응답 속도를 개선하고 싶습니다.
관련 제어 로직을 분석하여 PID 튜닝 방향을 제시해주세요.`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 min-h-[300px] resize-none font-mono text-sm"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!description.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      AI 분석 시작
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Analysis Results */}
          <div className="flex flex-col gap-3 min-h-0">
            <Card className="flex-1 min-h-0 flex flex-col">
              <CardHeader className="flex-none pb-3">
                <CardTitle className="text-lg">신호 분석</CardTitle>
                <CardDescription>
                  AI가 검색하고 분석한 내용
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 overflow-y-auto pt-0">
                {!analysisResult && !isAnalyzing && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    <div className="text-center">
                      <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>왼쪽에 개선 설명을 입력하고</p>
                      <p>"AI 분석 시작" 버튼을 눌러주세요</p>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-orange-500" />
                      <p className="text-sm text-muted-foreground">AI가 문서를 검색하고 분석하는 중...</p>
                    </div>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1 text-sm">분석 요약</h3>
                          <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Search Results */}
                    <div>
                      <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">검색 결과</Badge>
                      </h3>
                      <div className="space-y-2">
                        {analysisResult.searchResults.map((result: string, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg text-sm">
                            {result}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h3 className="font-semibold mb-1 text-sm">다음 단계</h3>
                      <p className="text-sm text-muted-foreground mb-3">{analysisResult.nextSteps}</p>
                      <Button className="w-full" size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        상세 분석 보고서 생성
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
