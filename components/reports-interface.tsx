"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, User, CheckCircle2, Trash2, Upload } from "lucide-react"
import { ReportPreview } from "@/components/report-preview"
import { PdfGenerator } from "@/components/pdf-generator"
import { getReports, deleteReport, saveReport, importReportFromJson, type Report } from "@/lib/report-storage"
import { toast } from "sonner"

export function ReportsInterface() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reports, setReports] = useState<Report[]>([])

  // 컴포넌트 마운트 시 리포트 불러오기
  useEffect(() => {
    const loadedReports = getReports()
    setReports(loadedReports)
  }, [])

  // 리포트 삭제
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (confirm("정말로 이 리포트를 삭제하시겠습니까?")) {
      try {
        deleteReport(id)
        setReports(getReports())
        if (selectedReport === id) {
          setSelectedReport(null)
        }
        toast.success("리포트가 삭제되었습니다.")
      } catch (error) {
        toast.error("리포트 삭제에 실패했습니다.")
      }
    }
  }

  // 리포트 가져오기
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const report = importReportFromJson(content)
        saveReport(report)
        setReports(getReports())
        toast.success("리포트를 가져왔습니다.")
      } catch (error) {
        toast.error("리포트 파일을 읽을 수 없습니다.")
      }
    }
    reader.readAsText(file)
    e.target.value = "" // 초기화
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card className="min-h-[calc(100vh-12rem)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>완료된 분석 리포트</CardTitle>
                <CardDescription>분석 결과를 확인하고 PDF로 다운로드하세요</CardDescription>
              </div>
              <div>
                <label htmlFor="import-report">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      가져오기
                    </span>
                  </Button>
                  <input
                    id="import-report"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImport}
                  />
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>저장된 리포트가 없습니다.</p>
                <p className="text-sm mt-1">분석을 완료하면 여기에 표시됩니다.</p>
              </div>
            ) : (
              reports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-colors ${
                    selectedReport === report.id ? "border-primary" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{report.title}</h4>
                          <Badge variant="outline">{report.type}</Badge>
                          {report.status === "completed" && (
                            <Badge className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              완료
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {report.author}
                          </span>
                          <span className="font-mono">ID: {report.signalId}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(report.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {selectedReport && <ReportPreview reportId={selectedReport} />}
      </div>

      <div className="space-y-4">
        <PdfGenerator reportId={selectedReport} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">리포트 통계</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">총 리포트</span>
              <span className="font-semibold">{reports.length}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">이번 달</span>
              <span className="font-semibold">
                {reports.filter(r => {
                  const reportDate = new Date(r.date)
                  const now = new Date()
                  return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
                }).length}개
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">완료율</span>
              <Badge className="bg-green-600">
                {reports.length > 0
                  ? Math.round((reports.filter(r => r.status === "completed").length / reports.length) * 100)
                  : 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
