"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles, FileText, TrendingUp } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: string[]
}

export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "안녕하세요! 저는 ControlLogic AI Analyzer의 AI 어시스턴트입니다. 제어로직 분석, PID 튜닝, TRIP 조건, 트렌드 분석 등에 대해 질문해주세요.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(inputValue),
        timestamp: new Date(),
        sources: ["운영 매뉴얼 3.2절", "P&ID 도면 A-123", "DCS 설정 가이드"],
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes("pid")) {
      return `PID 제어기 튜닝에 대해 설명드리겠습니다.

**PID 파라미터:**
- **Kp (비례 게인)**: 현재 오차에 비례하여 제어 출력을 조정합니다. 값이 클수록 응답이 빠르지만 오버슈트가 발생할 수 있습니다.
- **Ki (적분 게인)**: 누적 오차를 제거하여 정상 상태 오차를 줄입니다.
- **Kd (미분 게인)**: 오차의 변화율에 반응하여 안정성을 높입니다.

**튜닝 권장사항:**
1. 먼저 Kp 값을 조정하여 적절한 응답 속도를 찾으세요.
2. Ki 값을 천천히 증가시켜 정상 상태 오차를 제거하세요.
3. 필요시 Kd 값을 추가하여 오버슈트를 줄이세요.`
    }

    if (query.toLowerCase().includes("trip")) {
      return `TRIP 조건 분석에 대해 설명드리겠습니다.

**일반적인 TRIP 조건:**
- 온도 한계 초과 (High/Low Temperature)
- 압력 이상 (High/Low Pressure)
- 진동 과다 (High Vibration)
- 윤활유 압력 저하
- 냉각수 유량 부족

**분석 시 확인사항:**
1. 각 TRIP 조건의 설정값이 적절한지 확인
2. TRIP 발생 이력 분석
3. 불필요한 TRIP 조건 제거 검토
4. 다중 보호 계층 구성 확인`
    }

    return `질문에 대한 답변을 생성하고 있습니다. Miso RAG를 통해 관련 문서를 검색하여 정확한 정보를 제공하겠습니다.

분석 중인 내용:
- 관련 운영 매뉴얼 검색
- 유사 사례 분석
- 제어로직 최적화 방안

추가 질문이 있으시면 말씀해주세요.`
  }

  const suggestedQuestions = [
    "FCZ5202A 댐퍼의 PID 파라미터를 어떻게 튜닝하나요?",
    "DH 순환펌프의 TRIP 조건은 무엇인가요?",
    "온도 제어 성능을 개선하려면 어떻게 해야 하나요?",
    "Interlock 조건을 추가하는 방법은?",
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card className="flex flex-col h-[calc(100vh-220px)]">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI 어시스턴트</CardTitle>
              <CardDescription>Miso RAG 기반 지능형 분석</CardDescription>
            </div>
            <Badge variant="outline" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              활성
            </Badge>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <ReactMarkdown
                      className="prose prose-sm dark:prose-invert max-w-none"
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 ml-4">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {message.sources && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.sources.map((source, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce" />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <CardContent className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="질문을 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">추천 질문</CardTitle>
            <CardDescription>자주 묻는 질문들</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedQuestions.map((question, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-3 bg-transparent"
                onClick={() => setInputValue(question)}
              >
                <span className="text-sm line-clamp-2">{question}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">분석 기능</CardTitle>
            <CardDescription>AI가 지원하는 기능들</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">트렌드 분석</p>
                <p className="text-xs text-muted-foreground">이상 패턴 감지 및 예측</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">문서 검색</p>
                <p className="text-xs text-muted-foreground">운영 매뉴얼 및 도면 참조</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-chart-2 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">개선 제안</p>
                <p className="text-xs text-muted-foreground">AI 기반 최적화 방안</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
