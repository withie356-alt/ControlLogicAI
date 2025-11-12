import { AppHeader } from "@/components/app-header"
import { SignalSearchInterface } from "@/components/signal-search-interface"

export default function SearchPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">
      <AppHeader />
      <main className="container mx-auto px-6 py-4 flex-1 min-h-0 flex flex-col">
        <div className="mb-3 flex-none">
          <h1 className="text-2xl font-bold mb-1">신호 검색</h1>
          <p className="text-muted-foreground text-sm">제어 신호 및 계측 신호를 검색하여 분석을 시작하세요</p>
        </div>
        <div className="flex-1 min-h-0">
          <SignalSearchInterface />
        </div>
      </main>
    </div>
  )
}
