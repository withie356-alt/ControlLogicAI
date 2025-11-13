import { AppHeader } from "@/components/app-header"
import { ReportsInterface } from "@/components/reports-interface"
import { FolderOpen } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <AppHeader />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">분석 리포트</h2>
              <p className="text-muted-foreground text-sm">
                완료된 분석 결과 및 보고서 관리
              </p>
            </div>
          </div>
        </div>
        <ReportsInterface />
      </main>
    </div>
  )
}
