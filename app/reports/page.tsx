import { AppHeader } from "@/components/app-header"
import { ReportsInterface } from "@/components/reports-interface"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <AppHeader />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">분석 리포트</h2>
          <p className="text-muted-foreground">완료된 분석 결과를 확인하고 PDF 리포트를 생성하세요</p>
        </div>
        <ReportsInterface />
      </main>
    </div>
  )
}
