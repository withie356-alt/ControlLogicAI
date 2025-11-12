"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Lightbulb, MessageSquare } from "lucide-react"

interface ReportPreviewProps {
  reportId: string
}

export function ReportPreview({ reportId }: ReportPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>리포트 미리보기</CardTitle>
        <CardDescription>분석 결과 요약</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">요약</TabsTrigger>
            <TabsTrigger value="analysis">분석</TabsTrigger>
            <TabsTrigger value="suggestions">제안</TabsTrigger>
            <TabsTrigger value="chat">대화</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">분석 개요</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  FCZ5202A 댐퍼 제어 신호에 대한 PID 파라미터 튜닝 분석을 수행했습니다. 현재 설정값 대비 응답 속도와
                  안정성을 개선할 수 있는 방안을 도출했습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">주요 발견사항</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Kp 값이 낮아 응답 속도가 느림</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Ki 값 조정으로 정상 상태 오차 개선 가능</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Kd 값 추가로 오버슈트 감소 예상</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">권장 조치</h4>
                <div className="space-y-2">
                  <Badge>Kp: 2.5 → 3.5</Badge>
                  <Badge>Ki: 1.2 → 1.5</Badge>
                  <Badge>Kd: 0 → 0.3</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">상세 분석 결과</h4>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">트렌드 차트 및 분석 그래프</p>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">AI 개선 제안</h4>
            </div>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-3">
                  <h5 className="font-medium mb-1">PID 파라미터 최적화</h5>
                  <p className="text-sm text-muted-foreground">시뮬레이션 결과 응답 시간 30% 단축 예상</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <h5 className="font-medium mb-1">Interlock 조건 추가</h5>
                  <p className="text-sm text-muted-foreground">온도 한계 초과 시 자동 제한 기능</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">AI 대화 기록</h4>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <div className="text-sm">
                <p className="font-medium mb-1">Q: 현재 PID 설정이 적절한가요?</p>
                <p className="text-muted-foreground">A: 현재 설정은 안정적이나, 응답 속도 개선의 여지가 있습니다...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
