// 리포트 타입 정의
export interface Report {
  id: string
  title: string
  signalId: string
  type: string
  date: string
  author: string
  status: "completed" | "in_progress" | "draft"
  priority: "high" | "medium" | "low"
  data?: {
    summary?: string
    signalInfo?: Record<string, any>
    analysis?: string
    chatHistory?: Array<{ role: string; content: string }>
    suggestions?: string[]
  }
}

const STORAGE_KEY = "controllogic_reports"

// 모든 리포트 가져오기
export function getReports(): Report[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultReports()

    const reports = JSON.parse(stored) as Report[]
    return reports.length > 0 ? reports : getDefaultReports()
  } catch (error) {
    console.error("리포트 불러오기 오류:", error)
    return getDefaultReports()
  }
}

// 기본 리포트 (데모용)
function getDefaultReports(): Report[] {
  return [
    {
      id: "1",
      title: "FCZ5202A 댐퍼 제어 분석",
      signalId: "FCZ5202A",
      type: "PID 튜닝",
      date: new Date().toISOString().slice(0, 10),
      author: "홍길동",
      status: "completed",
      priority: "high",
      data: {
        summary: "댐퍼 제어 시스템의 PID 튜닝 최적화 분석",
        signalInfo: {
          type: "Flow Control",
          range: "0-100%",
          unit: "%"
        },
        analysis: "PID 제어 루프가 안정적으로 작동하고 있으나, 응답 속도 개선 필요",
        suggestions: [
          "비례 게인을 1.5에서 2.0으로 증가",
          "적분 시간을 5초에서 3초로 감소",
          "미분 시간 0.5초 유지"
        ]
      }
    },
    {
      id: "2",
      title: "DH 순환펌프 TRIP 조건 분석",
      signalId: "TRIP_DH_P01",
      type: "TRIP 분석",
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      author: "김철수",
      status: "completed",
      priority: "medium",
      data: {
        summary: "순환펌프 트립 조건 안전성 검토",
        signalInfo: {
          type: "TRIP Logic",
          conditions: ["저압", "고온", "진동"]
        },
        analysis: "모든 트립 조건이 정상 작동 중이며, 안전 마진 확보",
        suggestions: [
          "트립 지연 시간 검토 필요",
          "바이패스 밸브 동작 확인"
        ]
      }
    },
    {
      id: "3",
      title: "TI5201A 온도 제어 분석",
      signalId: "TI5201A",
      type: "온도 제어",
      date: new Date(Date.now() - 172800000).toISOString().slice(0, 10),
      author: "이영희",
      status: "completed",
      priority: "low",
      data: {
        summary: "2차 과열기 온도 제어 성능 분석",
        signalInfo: {
          type: "Temperature Indicator",
          range: "0-600°C",
          unit: "°C"
        },
        analysis: "온도 제어가 안정적이며 설정값 추종 성능 우수",
        suggestions: [
          "계절별 보정 계수 검토",
          "센서 교정 주기 확인"
        ]
      }
    }
  ]
}

// 리포트 ID로 단일 리포트 가져오기
export function getReportById(id: string): Report | undefined {
  const reports = getReports()
  return reports.find(report => report.id === id)
}

// 리포트 저장
export function saveReport(report: Report): void {
  if (typeof window === "undefined") return

  try {
    const reports = getReports()
    const existingIndex = reports.findIndex(r => r.id === report.id)

    if (existingIndex >= 0) {
      // 기존 리포트 업데이트
      reports[existingIndex] = report
    } else {
      // 새 리포트 추가
      reports.unshift(report) // 최신 리포트가 맨 위에 오도록
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  } catch (error) {
    console.error("리포트 저장 오류:", error)
    throw new Error("리포트를 저장할 수 없습니다.")
  }
}

// 리포트 삭제
export function deleteReport(id: string): void {
  if (typeof window === "undefined") return

  try {
    const reports = getReports()
    const filtered = reports.filter(report => report.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("리포트 삭제 오류:", error)
    throw new Error("리포트를 삭제할 수 없습니다.")
  }
}

// 새 리포트 ID 생성
export function generateReportId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// 리포트 내보내기 (JSON)
export function exportReportAsJson(report: Report): void {
  const dataStr = JSON.stringify(report, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `report_${report.signalId}_${report.date}.json`
  link.click()

  URL.revokeObjectURL(url)
}

// 리포트 가져오기 (JSON)
export function importReportFromJson(jsonString: string): Report {
  try {
    const report = JSON.parse(jsonString) as Report

    // 유효성 검사
    if (!report.id || !report.signalId || !report.title) {
      throw new Error("잘못된 리포트 형식입니다.")
    }

    return report
  } catch (error) {
    console.error("리포트 가져오기 오류:", error)
    throw new Error("리포트 파일을 읽을 수 없습니다.")
  }
}
