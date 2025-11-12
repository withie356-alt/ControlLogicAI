"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"

interface PdfGeneratorProps {
  reportId: string | null
}

// 나눔고딕 폰트를 Base64로 인코딩한 것 (실제로는 외부에서 로드해야 함)
// 여기서는 영문과 한글 혼용을 위해 기본 폰트 사용
function generatePDF(reportId: string, sections: Record<string, boolean>) {
  const doc = new jsPDF()

  // PDF 메타데이터
  doc.setProperties({
    title: `제어 로직 분석 리포트 - ${reportId}`,
    subject: 'Control Logic Analysis Report',
    author: 'ControlLogic AI Analyzer',
    keywords: 'control, logic, analysis, report',
    creator: 'ControlLogic AI'
  })

  let yPos = 20

  // 제목
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("Control Logic Analysis Report", 105, yPos, { align: "center" })

  yPos += 10
  doc.setFontSize(14)
  doc.text(`Report ID: ${reportId}`, 105, yPos, { align: "center" })

  yPos += 5
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${new Date().toLocaleDateString('ko-KR')}`, 105, yPos, { align: "center" })

  yPos += 15
  doc.line(20, yPos, 190, yPos) // 가로선
  yPos += 10

  // 분석 요약
  if (sections.summary) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("1. Analysis Summary", 20, yPos)
    yPos += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text("Signal Type: PID Control", 20, yPos)
    yPos += 6
    doc.text("Analysis Status: Completed", 20, yPos)
    yPos += 6
    doc.text("Priority: High", 20, yPos)
    yPos += 10
  }

  // 신호 정보
  if (sections.signalInfo) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("2. Signal Information", 20, yPos)
    yPos += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Signal ID: ${reportId}`, 20, yPos)
    yPos += 6
    doc.text("Description: Temperature Control Signal", 20, yPos)
    yPos += 6
    doc.text("Range: 0-100%", 20, yPos)
    yPos += 6
    doc.text("Unit: Celsius", 20, yPos)
    yPos += 10
  }

  // 상세 분석
  if (sections.analysis) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("3. Detailed Analysis", 20, yPos)
    yPos += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    const analysisText = "The control logic shows a PID control loop with cascade control configuration. The primary controller maintains temperature setpoint while the secondary controller handles flow rate adjustments."
    const splitText = doc.splitTextToSize(analysisText, 170)
    doc.text(splitText, 20, yPos)
    yPos += splitText.length * 6 + 4
  }

  // 트렌드 데이터
  if (sections.trends) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("4. Trend Analysis", 20, yPos)
    yPos += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text("Current Value: 350.5 C", 20, yPos)
    yPos += 6
    doc.text("Max Value (24h): 355.2 C", 20, yPos)
    yPos += 6
    doc.text("Min Value (24h): 345.8 C", 20, yPos)
    yPos += 6
    doc.text("Average: 350.1 C", 20, yPos)
    yPos += 10
  }

  // AI 대화 기록
  if (sections.chatHistory && yPos < 250) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("5. AI Chat History", 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "italic")
    doc.text("Q: What is the control strategy for this signal?", 20, yPos)
    yPos += 6
    doc.setFont("helvetica", "normal")
    const answer = "A: This signal uses a cascade PID control strategy with feedforward compensation for disturbance rejection."
    const splitAnswer = doc.splitTextToSize(answer, 170)
    doc.text(splitAnswer, 20, yPos)
    yPos += splitAnswer.length * 5 + 4
  }

  // 개선 제안
  if (sections.suggestions && yPos < 250) {
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("6. Improvement Suggestions", 20, yPos)
    yPos += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text("- Optimize PID tuning parameters for faster response", 20, yPos)
    yPos += 6
    doc.text("- Add feedforward control for better disturbance rejection", 20, yPos)
    yPos += 6
    doc.text("- Implement anti-windup mechanism", 20, yPos)
  }

  // 푸터
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
    doc.text("ControlLogic AI Analyzer - Confidential", 20, 290)
  }

  return doc
}

export function PdfGenerator({ reportId }: PdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    signalInfo: true,
    analysis: true,
    trends: true,
    chatHistory: true,
    suggestions: true,
  })

  const handleGenerate = async () => {
    if (!reportId) return

    setIsGenerating(true)

    try {
      // PDF 생성
      const doc = generatePDF(reportId, selectedSections)

      // 다운로드
      doc.save(`ControlLogic_Report_${reportId}_${new Date().toISOString().slice(0, 10)}.pdf`)

      setIsGenerating(false)
    } catch (error) {
      console.error("PDF 생성 오류:", error)
      alert("PDF 생성 중 오류가 발생했습니다.")
      setIsGenerating(false)
    }
  }

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">PDF 생성 옵션</CardTitle>
        <CardDescription>포함할 섹션을 선택하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="summary"
              checked={selectedSections.summary}
              onCheckedChange={() => toggleSection("summary")}
            />
            <Label htmlFor="summary" className="text-sm cursor-pointer">
              분석 요약
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="signalInfo"
              checked={selectedSections.signalInfo}
              onCheckedChange={() => toggleSection("signalInfo")}
            />
            <Label htmlFor="signalInfo" className="text-sm cursor-pointer">
              신호 정보
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="analysis"
              checked={selectedSections.analysis}
              onCheckedChange={() => toggleSection("analysis")}
            />
            <Label htmlFor="analysis" className="text-sm cursor-pointer">
              상세 분석 (P&ID, 로직)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="trends" checked={selectedSections.trends} onCheckedChange={() => toggleSection("trends")} />
            <Label htmlFor="trends" className="text-sm cursor-pointer">
              트렌드 차트
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="chatHistory"
              checked={selectedSections.chatHistory}
              onCheckedChange={() => toggleSection("chatHistory")}
            />
            <Label htmlFor="chatHistory" className="text-sm cursor-pointer">
              AI 대화 기록
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="suggestions"
              checked={selectedSections.suggestions}
              onCheckedChange={() => toggleSection("suggestions")}
            />
            <Label htmlFor="suggestions" className="text-sm cursor-pointer">
              개선 제안
            </Label>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <Button className="w-full" onClick={handleGenerate} disabled={!reportId || isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                PDF 다운로드
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {reportId ? "선택한 리포트의 PDF를 생성합니다" : "리포트를 먼저 선택하세요"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
