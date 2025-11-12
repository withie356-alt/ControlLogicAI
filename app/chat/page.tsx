import { AppHeader } from "@/components/app-header"
import { AiChatInterface } from "@/components/ai-chat-interface"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <AppHeader />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">AI 채팅</h2>
          <p className="text-muted-foreground">Miso RAG 기반 AI와 대화하며 제어로직에 대한 인사이트를 얻으세요</p>
        </div>
        <AiChatInterface />
      </main>
    </div>
  )
}
