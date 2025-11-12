"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  GitBranch,
  Settings,
  ShieldAlert,
  TrendingUp,
  Wrench,
  AlertTriangle,
} from "lucide-react"

interface ImprovementStepProps {
  signalId: string
}

export function ImprovementStep({ signalId }: ImprovementStepProps) {
  // 밸브 조작 흐름 및 절차
  const valveOperationFlow = {
    title: "밸브 조작 흐름 및 절차",
    icon: GitBranch,
    steps: [
      {
        step: 1,
        title: "조작 전 확인사항",
        items: [
          "현재 댐퍼 위치 확인 (DCS: FCZ5202A)",
          "과열증기 온도 확인 (TI5201A < 550°C)",
          "Spray 수 압력 정상 여부 확인",
          "자동/수동 모드 상태 확인",
        ],
      },
      {
        step: 2,
        title: "수동 조작 절차",
        items: [
          "자동 → 수동 모드 전환",
          "현재 출력값 확인 후 기록",
          "5%씩 단계적으로 조정 (급격한 변화 금지)",
          "각 조정 후 30초 대기 및 온도 변화 관찰",
          "목표값 도달 후 5분간 안정화 확인",
        ],
      },
      {
        step: 3,
        title: "자동 전환 절차",
        items: [
          "수동 출력값과 설정값(SV) 차이 확인",
          "차이가 ±5% 이내일 때 전환",
          "수동 → 자동 모드 전환",
          "PID 제어 응답 모니터링 (최소 10분)",
          "이상 진동 또는 헌팅 발생 시 즉시 수동 전환",
        ],
      },
      {
        step: 4,
        title: "비상 조치",
        items: [
          "온도 편차 ±20°C 초과 시 즉시 수동 전환",
          "댐퍼를 안전 위치 (50%)로 조정",
          "운전팀 및 유지보수팀 통보",
          "이벤트 로그 기록 및 보고",
        ],
      },
    ],
  }

  // 설비 개선 제안
  const equipmentImprovements = [
    {
      id: 1,
      title: "댐퍼 위치 센서 이중화",
      description: "현재 단일 센서로 인한 고장 시 제어 불가 문제 해결",
      priority: "high",
      impact: "신뢰성 향상, 정비 시간 단축",
      cost: "중간",
      period: "2-3개월",
    },
    {
      id: 2,
      title: "Spray 수 압력 트랜스미터 교체",
      description: "노후 계측기 교체로 정확도 개선",
      priority: "medium",
      impact: "제어 정확도 ±2% 향상",
      cost: "낮음",
      period: "1개월",
    },
    {
      id: 3,
      title: "댐퍼 구동기 정밀 진단",
      description: "마모 상태 확인 및 예방 정비",
      priority: "medium",
      impact: "응답성 개선, 고장 예방",
      cost: "낮음",
      period: "2주",
    },
  ]

  // PID 튜닝 제안
  const pidTuning = {
    current: {
      Kp: 2.5,
      Ki: 1.2,
      Kd: 0,
    },
    recommended: {
      Kp: 3.5,
      Ki: 1.5,
      Kd: 0.3,
    },
    rationale: [
      "현재 응답속도가 느림 (설정값 도달 시간 평균 180초)",
      "Overshoot 발생 (최대 8%)",
      "미세 진동 발생 (±1.5%)",
    ],
    expectedImpact: [
      "응답 시간 30% 단축 (180초 → 126초)",
      "Overshoot 3% 이하로 감소",
      "정상 상태 오차 ±0.5% 이내",
    ],
  }

  // 안전 주의사항
  const safetyWarnings = [
    {
      level: "critical",
      title: "과열증기 온도 한계",
      warning: "TI5201A > 550°C 시 댐퍼 동작 즉시 중단",
      action: "Interlock 로직 추가 권장",
    },
    {
      level: "high",
      title: "Spray 수 압력 이상",
      warning: "압력 < 15 bar 시 수동 모드 전환 필수",
      action: "저압 알람 설정값 검토",
    },
    {
      level: "medium",
      title: "급격한 출력 변화 금지",
      warning: "최대 변화율 5%/분 준수",
      action: "Rate Limiter 기능 활성화",
    },
  ]

  // 유지보수 권장사항
  const maintenanceRecommendations = [
    {
      task: "센서 교정",
      frequency: "6개월",
      nextDue: "2025-07-15",
      priority: "high",
    },
    {
      task: "댐퍼 작동 테스트",
      frequency: "3개월",
      nextDue: "2025-04-15",
      priority: "medium",
    },
    {
      task: "배선 및 접속부 점검",
      frequency: "1년",
      nextDue: "2026-01-15",
      priority: "medium",
    },
    {
      task: "DCS 로직 백업",
      frequency: "1개월",
      nextDue: "2025-02-15",
      priority: "high",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-chart-3 text-white"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="h-full max-h-full flex flex-col overflow-hidden">
      <Card className="flex-1 min-h-0 max-h-full flex flex-col overflow-hidden">
        <CardHeader className="flex-none border-b">
          <div>
            <CardTitle>AI 기반 개선 제안 및 조언</CardTitle>
            <CardDescription>2단계 질의응답을 바탕으로 생성된 실무 가이드</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-6">
          <div className="space-y-8">

            {/* 전체적인 분석결과 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-primary">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-primary">전체적인 분석결과</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center shrink-0">
                        <GitBranch className="h-5 w-5 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">조작 절차</h4>
                        <p className="text-sm text-muted-foreground">4단계 운전 프로세스 및 비상 조치 가이드</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">설비 개선</h4>
                        <p className="text-sm text-muted-foreground">3건의 개선 제안 (우선순위: 높음 1건, 중간 2건)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">PID 튜닝</h4>
                        <p className="text-sm text-muted-foreground">응답 시간 30% 개선 가능 (180초 → 126초)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                        <ShieldAlert className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">안전 주의사항</h4>
                        <p className="text-sm text-muted-foreground">3건의 필수 준수사항 (매우 높음 1건, 높음 2건)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-chart-4/30 bg-gradient-to-br from-chart-4/5 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center shrink-0">
                      <Wrench className="h-5 w-5 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">유지보수 계획</h4>
                      <p className="text-sm text-muted-foreground">4건의 정기 점검 일정 (다음 예정: 센서 교정 2025-02-15)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 세부적인 결과 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-chart-2">
                <div className="h-8 w-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-chart-2" />
                </div>
                <h2 className="text-xl font-bold text-chart-2">세부적인 결과</h2>
              </div>

            {/* 1. 밸브 조작 절차 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{valveOperationFlow.title}</h3>
                  <p className="text-sm text-muted-foreground">현장 운전원을 위한 단계별 가이드</p>
                </div>
              </div>

              <div className="space-y-3">
                {valveOperationFlow.steps.map((step) => (
                  <Card key={step.step}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">{step.title}</h4>
                          <ul className="space-y-1">
                            {step.items.map((item, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 2. 설비 개선 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">설비 개선 제안</h3>
                  <p className="text-sm text-muted-foreground">중장기 신뢰성 및 성능 향상 방안</p>
                </div>
              </div>

              <div className="space-y-3">
                {equipmentImprovements.map((improvement) => (
                  <Card key={improvement.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Lightbulb className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold">{improvement.title}</h4>
                            <Badge className={getPriorityColor(improvement.priority)}>
                              {improvement.priority === "high" ? "높음" : "중간"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{improvement.description}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">영향: </span>
                              <span>{improvement.impact}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">비용: </span>
                              <span>{improvement.cost}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">기간: </span>
                              <span>{improvement.period}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 3. PID 튜닝 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">PID 파라미터 튜닝 제안</h3>
                  <p className="text-sm text-muted-foreground">응답성 및 안정성 개선 방안</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">현재 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">비례 게인 (Kp)</span>
                      <span className="font-mono font-semibold">{pidTuning.current.Kp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">적분 게인 (Ki)</span>
                      <span className="font-mono font-semibold">{pidTuning.current.Ki}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">미분 게인 (Kd)</span>
                      <span className="font-mono font-semibold">{pidTuning.current.Kd}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      권장 설정
                      <Badge variant="outline" className="text-xs">개선안</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">비례 게인 (Kp)</span>
                      <span className="font-mono font-semibold text-primary">{pidTuning.recommended.Kp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">적분 게인 (Ki)</span>
                      <span className="font-mono font-semibold text-primary">{pidTuning.recommended.Ki}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">미분 게인 (Kd)</span>
                      <span className="font-mono font-semibold text-primary">{pidTuning.recommended.Kd}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">튜닝 근거</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h5 className="text-sm font-semibold mb-2">현재 문제점</h5>
                    <ul className="space-y-1">
                      {pidTuning.rationale.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold mb-2">예상 효과</h5>
                    <ul className="space-y-1">
                      {pidTuning.expectedImpact.map((impact, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 4. 안전 주의사항 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">안전 주의사항</h3>
                  <p className="text-sm text-muted-foreground">운전 시 필수 준수 사항</p>
                </div>
              </div>

              <div className="space-y-3">
                {safetyWarnings.map((warning, idx) => (
                  <Card key={idx} className={warning.level === "critical" ? "border-destructive" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                            warning.level === "critical"
                              ? "bg-destructive/10"
                              : warning.level === "high"
                                ? "bg-chart-3/10"
                                : "bg-muted"
                          }`}
                        >
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              warning.level === "critical"
                                ? "text-destructive"
                                : warning.level === "high"
                                  ? "text-chart-3"
                                  : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold">{warning.title}</h4>
                            <Badge className={getPriorityColor(warning.level)}>
                              {warning.level === "critical" ? "매우 높음" : warning.level === "high" ? "높음" : "중간"}
                            </Badge>
                          </div>
                          <p className="text-sm text-destructive font-medium">{warning.warning}</p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">조치: </span>
                            {warning.action}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 5. 유지보수 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">유지보수 계획</h3>
                  <p className="text-sm text-muted-foreground">정기 점검 및 예방 정비 일정</p>
                </div>
              </div>

              <div className="space-y-3">
                {maintenanceRecommendations.map((task, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{task.task}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>주기: {task.frequency}</span>
                            <span>다음 예정: {task.nextDue}</span>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === "high" ? "높음" : "중간"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  )
}
