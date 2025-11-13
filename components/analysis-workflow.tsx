"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronRight, ChevronLeft, Check, Save, Download, Loader2 } from "lucide-react"
import { SignalOverviewStep } from "@/components/workflow-steps/signal-overview-step"
import { AiQueryStep } from "@/components/workflow-steps/ai-query-step"
import { ImprovementStep } from "@/components/workflow-steps/improvement-step"
import { saveReport, generateReportId } from "@/lib/report-storage"
import { toast } from "sonner"

interface AnalysisWorkflowProps {
  signalId: string
}

const WORKFLOW_STEPS = [
  { id: 1, title: "신호 개요", description: "선택한 신호의 기본 정보 및 문서 확인" },
  { id: 2, title: "AI 질의", description: "AI와 대화하며 추가 정보 획득" },
  { id: 3, title: "개선 제안", description: "AI 기반 개선 방안 검토" },
]

export function AnalysisWorkflow({ signalId }: AnalysisWorkflowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    analysis: true,
    suggestions: true,
    chat: true,
  })

  const progress = ((currentStep - 1) / (WORKFLOW_STEPS.length - 1)) * 100

  const handleNext = () => {
    if (currentStep < WORKFLOW_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleOpenSaveDialog = () => {
    setShowSaveDialog(true)
  }

  const handleSaveOnly = () => {
    setIsSaving(true)

    try {
      // 리포트 데이터 생성
      const report = {
        id: generateReportId(),
        title: `${signalId} 제어 로직 분석`,
        signalId: signalId,
        type: signalId.startsWith("T") ? "온도 제어" : signalId.startsWith("P") ? "압력 제어" : "제어 로직",
        date: new Date().toISOString().slice(0, 10),
        author: "사용자",
        status: "completed" as const,
        priority: "medium" as const,
        data: {
          summary: `${signalId} 신호에 대한 제어 로직 분석이 완료되었습니다.`,
          signalInfo: {
            type: "Control Signal",
            range: "0-100%",
            unit: signalId.startsWith("T") ? "°C" : signalId.startsWith("P") ? "bar" : "%"
          },
          analysis: "4단계 분석 워크플로우를 통해 P&ID, 로직 다이어그램, 트렌드 분석 및 AI 질의가 완료되었습니다.",
          suggestions: [
            "제어 로직의 안정성을 유지하기 위한 정기적인 점검 필요",
            "PID 파라미터 튜닝을 통한 응답 속도 개선 검토",
            "센서 교정 주기 확인 및 유지보수 계획 수립"
          ]
        }
      }

      // 리포트 저장
      saveReport(report)

      toast.success("분석이 완료되고 리포트가 저장되었습니다!")

      // 리포트 페이지로 이동
      setTimeout(() => {
        router.push("/reports")
      }, 1000)

    } catch (error) {
      console.error("리포트 저장 오류:", error)
      toast.error("리포트 저장 중 오류가 발생했습니다.")
      setIsSaving(false)
    }
  }

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true)

    // PDF 생성 시뮬레이션
    setTimeout(() => {
      setIsGeneratingPdf(false)
      toast.success("PDF 리포트가 생성되었습니다!")

      // 저장 후 리포트 페이지로 이동
      handleSaveOnly()
      setShowSaveDialog(false)
    }, 2000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SignalOverviewStep signalId={signalId} />
      case 2:
        return <AiQueryStep signalId={signalId} />
      case 3:
        return <ImprovementStep signalId={signalId} />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="space-y-4 flex-none">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">로직 분석</h2>
            <p className="text-sm text-muted-foreground">신호 ID: {signalId}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {currentStep}/{WORKFLOW_STEPS.length} 단계
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSaving}
                className="shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 active:bg-muted"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                이전
              </Button>
              {currentStep === WORKFLOW_STEPS.length ? (
                <Button
                  size="sm"
                  onClick={handleOpenSaveDialog}
                  disabled={isSaving}
                  className="shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Save className="mr-2 h-4 w-4" />
                  분석 완료 및 저장
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  다음
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Progress value={progress} className="h-2 bg-muted/50 shadow-sm" />
            <div className="absolute -top-1 left-0 w-full flex justify-between px-1">
              {WORKFLOW_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-4 w-4 rounded-full border-2 transition-all ${
                    currentStep > step.id
                      ? "bg-primary border-primary shadow-sm"
                      : currentStep === step.id
                        ? "bg-primary border-primary ring-4 ring-primary/20"
                        : "bg-background border-muted-foreground/30"
                  }`}
                  style={{ marginLeft: index === 0 ? "0" : "-8px" }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {WORKFLOW_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`group text-left p-4 rounded-lg border-2 transition-all duration-200 active:scale-[0.98] ${
                  currentStep === step.id
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : currentStep > step.id
                      ? "border-green-500/50 bg-green-500/5 hover:shadow-md active:bg-green-500/10"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-md active:bg-muted"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0 transition-all ${
                      currentStep > step.id
                        ? "bg-green-500 text-white shadow-md"
                        : currentStep === step.id
                          ? "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold leading-tight mb-1 ${
                      currentStep === step.id ? "text-primary" : currentStep > step.id ? "text-green-600 dark:text-green-400" : ""
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">{renderStepContent()}</div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>분석 완료 및 저장</DialogTitle>
            <DialogDescription>
              분석 결과를 저장하고 PDF 리포트를 생성할 수 있습니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">리포트에 포함할 내용 선택</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="summary"
                    checked={selectedSections.summary}
                    onCheckedChange={(checked) =>
                      setSelectedSections((prev) => ({ ...prev, summary: !!checked }))
                    }
                  />
                  <Label htmlFor="summary" className="text-sm cursor-pointer">
                    신호 정보 및 분석 요약
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="suggestions"
                    checked={selectedSections.suggestions}
                    onCheckedChange={(checked) =>
                      setSelectedSections((prev) => ({ ...prev, suggestions: !!checked }))
                    }
                  />
                  <Label htmlFor="suggestions" className="text-sm cursor-pointer">
                    AI 개선 제안 및 조언
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chat"
                    checked={selectedSections.chat}
                    onCheckedChange={(checked) =>
                      setSelectedSections((prev) => ({ ...prev, chat: !!checked }))
                    }
                  />
                  <Label htmlFor="chat" className="text-sm cursor-pointer">
                    AI 대화 기록
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="analysis"
                    checked={selectedSections.analysis}
                    onCheckedChange={(checked) =>
                      setSelectedSections((prev) => ({ ...prev, analysis: !!checked }))
                    }
                  />
                  <Label htmlFor="analysis" className="text-sm cursor-pointer">
                    P&ID 및 트렌드 분석
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf || isSaving}
              className="w-full shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  PDF 생성 중...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  PDF 다운로드 및 저장
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleSaveOnly()
                setShowSaveDialog(false)
              }}
              disabled={isGeneratingPdf || isSaving}
              className="w-full shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] active:bg-muted"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "저장 중..." : "저장만 하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
