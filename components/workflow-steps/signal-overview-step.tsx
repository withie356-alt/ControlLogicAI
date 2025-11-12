"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, MapPin, FileText, Calendar, Book, Network, Upload, X, Search, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface SignalOverviewStepProps {
  signalId: string
}

type DocumentType = "pid" | "logic" | "manual" | "updates" | null

export function SignalOverviewStep({ signalId }: SignalOverviewStepProps) {
  const [openDialog, setOpenDialog] = useState<DocumentType>(null)
  const [pidImage, setPidImage] = useState<string | null>(null)
  const [logicImage, setLogicImage] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'pid' | 'logic') => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'pid') {
          setPidImage(result)
        } else {
          setLogicImage(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (type: 'pid' | 'logic') => {
    if (type === 'pid') {
      setPidImage(null)
    } else {
      setLogicImage(null)
    }
  }

  // Auto-search for diagrams when component mounts
  useEffect(() => {
    const searchForDiagrams = async () => {
      setIsSearching(true)

      // Simulate API call to search for diagrams
      // In a real implementation, this would search a database or file system
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock: randomly decide if diagrams are found (70% chance)
      const diagramsFound = Math.random() > 0.3

      if (diagramsFound) {
        // Mock: set placeholder images (in real app, would be actual diagram URLs)
        // For now, we'll leave them null and user can upload
        // In production, you'd set: setPidImage(foundPidUrl) and setLogicImage(foundLogicUrl)
      }

      setIsSearching(false)
    }

    searchForDiagrams()
  }, [signalId])

  // Mock data - would be fetched based on signalId
  const signalData = {
    tagName: "FCZ5202A",
    description: "RH A 2차 과열기 Spray 댐퍼",
    type: "PID 제어",
    category: "제어 신호",
    location: "RH A 2차 과열기",
    unit: "%",
    range: "0-100",
    lastUpdated: "2025-01-15 14:32:00",
    status: "정상",
    currentValue: "45.2",
  }

  // Mock update history data
  const updateHistory = [
    {
      date: "2025-01-15 14:32:00",
      type: "PID 파라미터 조정",
      description: "댐퍼 응답속도 개선을 위한 PID 게인 조정 (Kp: 1.2 → 1.5)",
      author: "운전팀",
      priority: "중간"
    },
    {
      date: "2024-12-10 09:15:00",
      type: "설정값 변경",
      description: "최대 개도율 제한 설정 변경 (95% → 90%)",
      author: "유지보수팀",
      priority: "높음"
    },
    {
      date: "2024-11-22 16:45:00",
      type: "센서 교정",
      description: "댐퍼 위치 센서 교정 작업 완료",
      author: "계측팀",
      priority: "낮음"
    },
  ]

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 h-full max-h-full overflow-hidden">
        <Card className="flex flex-col h-full max-h-full overflow-hidden">
          <CardHeader className="flex-none">
            <CardTitle>신호 기본 정보</CardTitle>
            <CardDescription>선택한 신호의 기본 속성</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">태그명</span>
              </div>
              <p className="font-mono text-lg font-semibold">{signalData.tagName}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">설명</span>
              </div>
              <p className="text-sm">{signalData.description}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">위치</span>
              </div>
              <p className="text-sm">{signalData.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">신호 유형</p>
                <Badge className="bg-blue-500/90 hover:bg-blue-500 text-white border-0">{signalData.type}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">카테고리</p>
                <Badge className="bg-purple-500/90 hover:bg-purple-500 text-white border-0">{signalData.category}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">단위</p>
                <Badge variant="secondary" className="font-mono">{signalData.unit}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">범위</p>
                <Badge variant="secondary" className="font-mono">{signalData.range}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full max-h-full overflow-hidden">
          <CardHeader className="flex-none">
            <CardTitle>문서 및 자료</CardTitle>
            <CardDescription>P&ID, 매뉴얼, 업데이트 이력</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin">
            <div className="space-y-3">
              <div
                className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setOpenDialog("pid")}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1">P&ID 도면</p>
                    <p className="text-xs text-muted-foreground">RH-A-001-Rev3.pdf</p>
                    <p className="text-xs text-muted-foreground mt-1">RH A계통 2차 과열기 제어 도면</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    보기
                  </Button>
                </div>
              </div>

              <div
                className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setOpenDialog("logic")}
              >
                <div className="flex items-center gap-3">
                  <Network className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1">로직 다이어그램</p>
                    <p className="text-xs text-muted-foreground">FCZ5202A_Logic_Diagram_v1.5.pdf</p>
                    <p className="text-xs text-muted-foreground mt-1">제어 로직 흐름도 및 연동 도면</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    보기
                  </Button>
                </div>
              </div>

              <div
                className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setOpenDialog("manual")}
              >
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1">운전 매뉴얼</p>
                    <p className="text-xs text-muted-foreground">FCZ5202A_Manual_v2.1.pdf</p>
                    <p className="text-xs text-muted-foreground mt-1">댐퍼 제어 로직 운전 지침서</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    보기
                  </Button>
                </div>
              </div>

              <div
                className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setOpenDialog("updates")}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-chart-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1">업데이트 이력</p>
                    <p className="text-xs text-muted-foreground">최근 수정: {signalData.lastUpdated}</p>
                    <p className="text-xs text-muted-foreground mt-1">관련 수정건 {updateHistory.length}건</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    보기
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&ID Dialog */}
      <Dialog open={openDialog === "pid"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>P&ID 도면</DialogTitle>
            <DialogDescription>RH A계통 2차 과열기 제어 도면</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isSearching ? (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">도면 검색 중...</p>
                </div>
              </div>
            ) : pidImage ? (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                  <Image
                    src={pidImage}
                    alt="P&ID Diagram"
                    width={800}
                    height={450}
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage('pid')}
                >
                  <X className="h-4 w-4 mr-1" />
                  제거
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="기존 도면 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    검색
                  </Button>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed hover:border-primary/50 transition-colors">
                  <label className="cursor-pointer text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'pid')}
                    />
                    <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">자동 검색 결과 없음</p>
                    <p className="text-xs text-muted-foreground mt-1">위에서 기존 도면을 검색하거나 새 도면을 업로드하세요</p>
                    <Button variant="outline" size="sm" className="mt-3" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      이미지 업로드
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Logic Diagram Dialog */}
      <Dialog open={openDialog === "logic"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>로직 다이어그램</DialogTitle>
            <DialogDescription>제어 로직 흐름도 및 연동 도면</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isSearching ? (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">다이어그램 검색 중...</p>
                </div>
              </div>
            ) : logicImage ? (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                  <Image
                    src={logicImage}
                    alt="Logic Diagram"
                    width={800}
                    height={450}
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage('logic')}
                >
                  <X className="h-4 w-4 mr-1" />
                  제거
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="기존 다이어그램 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    검색
                  </Button>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed hover:border-primary/50 transition-colors">
                  <label className="cursor-pointer text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'logic')}
                    />
                    <Network className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">자동 검색 결과 없음</p>
                    <p className="text-xs text-muted-foreground mt-1">위에서 기존 다이어그램을 검색하거나 새 도면을 업로드하세요</p>
                    <Button variant="outline" size="sm" className="mt-3" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      이미지 업로드
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Dialog */}
      <Dialog open={openDialog === "manual"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>운전 매뉴얼</DialogTitle>
            <DialogDescription>댐퍼 제어 로직 운전 지침서</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">1. 개요</h4>
              <p className="text-muted-foreground">
                FCZ5202A는 RH A 2차 과열기 Spray 댐퍼 제어 신호로,
                과열증기 온도를 적정 범위로 유지하기 위한 PID 제어 로직입니다.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">2. 운전 절차</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>자동 모드 전환 전 수동 모드에서 댐퍼 작동 상태 확인</li>
                <li>설정값(SV)이 현재 과열증기 온도와 유사한지 확인</li>
                <li>자동 모드 전환 후 PID 제어 응답 모니터링</li>
                <li>비정상 동작 시 즉시 수동 모드로 전환</li>
              </ul>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">3. 주의 사항</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>급격한 설정값 변경 금지 (최대 변화율: 5%/분)</li>
                <li>댐퍼 개도율이 90% 이상일 경우 운전팀에 통보</li>
                <li>Spray 수 압력 이상 시 즉시 수동 모드 전환</li>
              </ul>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">4. 비상 조치</h4>
              <p className="text-muted-foreground">
                과열증기 온도가 설정값 대비 ±20℃ 이상 편차 발생 시:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>즉시 수동 모드로 전환</li>
                <li>댐퍼 위치를 안전 위치(50%)로 조정</li>
                <li>운전팀 및 유지보수팀에 즉시 통보</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Updates History Dialog */}
      <Dialog open={openDialog === "updates"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>업데이트 이력</DialogTitle>
            <DialogDescription>이 신호와 관련된 수정 및 변경 이력</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {updateHistory.map((update, index) => (
              <div key={index} className="p-4 border border-border/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{update.type}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{update.date}</p>
                  </div>
                  <Badge variant={update.priority === "높음" ? "destructive" : update.priority === "중간" ? "default" : "outline"}>
                    {update.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {update.author}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
