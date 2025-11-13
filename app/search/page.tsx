import { AppHeader } from "@/components/app-header"
import { AiChatInterface } from "@/components/ai-chat-interface"
import { Bot } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">
      <AppHeader />
      <main className="container mx-auto px-6 py-6 flex-1 min-h-0 flex flex-col">
        <div className="mb-6 flex-none">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI 어시스턴트</h1>
              <p className="text-muted-foreground text-sm">
                Miso RAG 기반 지능형 분석
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <AiChatInterface />
        </div>
      </main>
    </div>
  )
}
