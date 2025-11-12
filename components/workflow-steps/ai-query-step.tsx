"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, FileText, Activity, MapPin, MessageSquare, Network, Book, Calendar } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface AiQueryStepProps {
  signalId: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: string[]
}

interface QuerySummary {
  id: string
  question: string
  answer: string
  timestamp: Date
}

export function AiQueryStep({ signalId }: AiQueryStepProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `${signalId} 신호에 대해 질문해주세요. 제어로직, 파라미터 설정, 운영 방법 등에 대해 답변해드리겠습니다.`,
      timestamp: new Date(),
    },
  ])
  const [querySummaries, setQuerySummaries] = useState<QuerySummary[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const summaryScrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock signal data
  const signalData = {
    tagName: "FCZ5202A",
    description: "RH A 2차 과열기 Spray 댐퍼",
    type: "PID 제어",
    location: "RH A 2차 과열기",
    unit: "%",
    range: "0-100",
  }

  // Mock documents data - 조건부로 표시할 문서들
  const documents = [
    { id: "pid", name: "P&ID 도면", file: "RH-A-001-Rev3.pdf", icon: FileText, available: true },
    { id: "logic", name: "로직 다이어그램", file: "FCZ5202A_Logic_Diagram_v1.5.pdf", icon: Network, available: true },
    { id: "manual", name: "운전 매뉴얼", file: "FCZ5202A_Manual_v2.1.pdf", icon: Book, available: false },
  ]

  // 실제로 사용 가능한 문서만 필터링
  const availableDocuments = documents.filter(doc => doc.available)

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      })
    }
  }, [messages])

  // Auto-scroll query summaries to bottom when new summaries are added
  useEffect(() => {
    if (summaryScrollRef.current) {
      requestAnimationFrame(() => {
        if (summaryScrollRef.current) {
          summaryScrollRef.current.scrollTop = summaryScrollRef.current.scrollHeight
        }
      })
    }
  }, [querySummaries])

  // Auto-focus input when loading state changes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isLoading])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userQuestion = inputValue
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userQuestion,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Keep focus on input immediately after sending
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    })

    setTimeout(() => {
      const aiResponseContent = `${signalId} 관련 정보를 찾았습니다. 현재 설정값과 운영 이력을 기반으로 분석한 결과, 정상 범위 내에서 운영되고 있습니다.`
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: ["운영 매뉴얼", "DCS 설정"],
      }
      setMessages((prev) => [...prev, aiResponse])

      // Add to query summaries
      const summary: QuerySummary = {
        id: Date.now().toString(),
        question: userQuestion,
        answer: aiResponseContent.substring(0, 100) + "...", // Summary of answer
        timestamp: new Date(),
      }
      setQuerySummaries((prev) => [...prev, summary])

      setIsLoading(false)
    }, 1000)
  }

  const quickQuestions = ["현재 설정값이 적절한가요?", "최근 이상 동작이 있었나요?", "튜닝이 필요한가요?"]

  return (
    <div className="grid gap-6 md:grid-cols-2 h-full max-h-full overflow-hidden">
      {/* Left Column: Signal Info & Query Summaries */}
      <Card className="flex flex-col h-full max-h-full overflow-hidden">
        <CardHeader className="flex-none">
          <CardTitle>신호 정보 및 질의 요약</CardTitle>
          <CardDescription>기본 정보와 질의응답 이력</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 min-h-0 flex flex-col">
          {/* Top Section: Signal Info + Documents in 2 columns */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 pb-4 border-b flex-none">
            {/* Signal Basic Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-primary" />
                신호 기본 정보
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">태그명</span>
                  <span className="font-mono font-semibold">{signalData.tagName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">설명</span>
                  <span className="text-right">{signalData.description}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">유형</span>
                  <Badge variant="outline">{signalData.type}</Badge>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">위치</span>
                  <span className="text-right">{signalData.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">범위</span>
                  <span className="font-mono">{signalData.range} {signalData.unit}</span>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-border self-stretch" />

            {/* Documents - 조건부 렌더링 */}
            {availableDocuments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-chart-2" />
                  문서 및 자료
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {availableDocuments.length}건
                  </Badge>
                </h3>
                <div className="space-y-2 text-sm">
                  {availableDocuments.map((doc) => {
                    const Icon = doc.icon
                    return (
                      <div
                        key={doc.id}
                        className="flex justify-between items-center py-1 cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">{doc.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">{doc.file}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Query Summaries */}
          <div className="space-y-3 flex-1 min-h-0 flex flex-col">
            <h3 className="text-sm font-semibold flex items-center gap-2 flex-none">
              <MessageSquare className="h-4 w-4 text-accent" />
              질의응답 요약
              <Badge variant="secondary" className="ml-auto text-xs">
                {querySummaries.length}건
              </Badge>
            </h3>
            {querySummaries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                아직 질의응답 내역이 없습니다
              </p>
            ) : (
              <div className="space-y-2 flex-1 min-h-0 overflow-y-auto scrollbar-thin" ref={summaryScrollRef}>
                {querySummaries.map((summary) => (
                  <div
                    key={summary.id}
                    className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <p className="text-xs font-semibold text-primary mb-1">Q: {summary.question}</p>
                    <p className="text-xs text-muted-foreground">{summary.answer}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {summary.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Chat Interface */}
      <Card className="h-full max-h-full flex flex-col overflow-hidden">
        <CardHeader className="border-b flex-none">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI 질의 응답</CardTitle>
              <CardDescription>Miso RAG 기반 AI에게 질문하여 추가 정보를 얻으세요</CardDescription>
            </div>
            <Badge variant="outline">활성</Badge>
          </div>
        </CardHeader>

        <div className="flex-1 p-4 min-h-0 overflow-y-auto scrollbar-thin" ref={scrollRef}>
          <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`flex-1 max-w-[80%]`}>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
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
        </div>

        <CardContent className="border-t p-4 space-y-3 flex-none">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, idx) => (
              <Button key={idx} variant="outline" size="sm" onClick={() => setInputValue(question)}>
                {question}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="질문을 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
