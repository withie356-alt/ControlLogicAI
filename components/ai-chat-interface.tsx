"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles, FileText, TrendingUp, X, Trash2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: string[]
}

interface ConversationHistory {
  id: string
  query: string
  timestamp: Date
}

export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<ConversationHistory[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // 로컬스토리지에서 히스토리 로드
  useEffect(() => {
    const savedHistory = localStorage.getItem('chat-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    }
  }, [])

  // 히스토리 저장
  const saveHistory = (newHistory: ConversationHistory[]) => {
    localStorage.setItem('chat-history', JSON.stringify(newHistory))
    setHistory(newHistory)
  }

  useEffect(() => {
    if (scrollRef.current) {
      const lastMessage = scrollRef.current.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
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

    // 히스토리에 추가
    const newHistoryItem: ConversationHistory = {
      id: Date.now().toString(),
      query: inputValue,
      timestamp: new Date()
    }
    const newHistory = [newHistoryItem, ...history].slice(0, 10) // 최대 10개 유지
    saveHistory(newHistory)

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // 실제 Miso AI API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API 호출 실패')
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || '응답을 받을 수 없습니다.',
        timestamp: new Date(),
        sources: data.sources || [],
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('AI response error:', error)

      // 에러 발생 시 폴백 응답
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `죄송합니다. AI 응답 생성 중 오류가 발생했습니다.\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
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
      <Card className="flex flex-col h-[calc(100vh-220px)] border-2">
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full w-full p-4">
            <div className="space-y-4 pb-4" ref={scrollRef}>
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
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full divide-y divide-border border border-border">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                          tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
                          tr: ({ children }) => <tr>{children}</tr>,
                          th: ({ children }) => (
                            <th className="px-3 py-2 text-left text-xs font-semibold">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-3 py-2 text-xs">
                              {children}
                            </td>
                          ),
                          img: ({ src, alt }) => (
                            <img src={src} alt={alt} className="max-w-full h-auto rounded-md my-2" />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
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
        </div>

        <div className="border-t bg-muted/30 p-4 flex-none">
          <div className="flex gap-2">
            <Input
              placeholder="메시지를 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="bg-background"
            />
            <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
                className="w-full justify-start text-left h-auto py-2 px-3 bg-transparent hover:bg-accent/50"
                onClick={() => setInputValue(question)}
              >
                <span className="text-xs leading-relaxed whitespace-normal">{question}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">과거 질문</CardTitle>
                <CardDescription>최근 대화 내역</CardDescription>
              </div>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveHistory([])}
                  className="h-8 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  전체 삭제
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                아직 대화 내역이 없습니다
              </div>
            ) : (
              history.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 p-2 rounded-md hover:bg-accent/30 transition-colors"
                >
                  <button
                    onClick={() => setInputValue(item.query)}
                    className="flex-1 text-left text-xs text-muted-foreground hover:text-foreground line-clamp-2 leading-relaxed"
                  >
                    {item.query}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newHistory = history.filter(h => h.id !== item.id)
                      saveHistory(newHistory)
                    }}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
