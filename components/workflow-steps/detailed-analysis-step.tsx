"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Network, TrendingUp, Upload, X } from "lucide-react"
import { TrendChart } from "@/components/trend-chart"
import Image from "next/image"

interface DetailedAnalysisStepProps {
  signalId: string
}

export function DetailedAnalysisStep({ signalId }: DetailedAnalysisStepProps) {
  const [pidImage, setPidImage] = useState<string | null>(null)
  const [logicImage, setLogicImage] = useState<string | null>(null)

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

  return (
    <div className="grid gap-6 md:grid-cols-2 h-full">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>도면 및 다이어그램</CardTitle>
          <CardDescription>P&ID, 로직 다이어그램 업로드</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <Tabs defaultValue="pid" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pid">P&ID</TabsTrigger>
              <TabsTrigger value="logic">로직 다이어그램</TabsTrigger>
            </TabsList>

            <TabsContent value="pid" className="space-y-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">P&ID 다이어그램</h3>
              <Badge>이미지 업로드</Badge>
            </div>

            {pidImage ? (
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
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed hover:border-primary/50 transition-colors">
                <label className="cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'pid')}
                  />
                  <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">P&ID 다이어그램 첨부</p>
                  <p className="text-xs text-muted-foreground mt-1">이미지 파일을 클릭하여 업로드하세요</p>
                  <Button variant="outline" size="sm" className="mt-3" type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    이미지 선택
                  </Button>
                </label>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logic" className="space-y-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Network className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">제어 로직 다이어그램</h3>
              <Badge>이미지 업로드</Badge>
            </div>

            {logicImage ? (
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
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed hover:border-primary/50 transition-colors">
                <label className="cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'logic')}
                  />
                  <Network className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">로직 다이어그램 첨부</p>
                  <p className="text-xs text-muted-foreground mt-1">이미지 파일을 클릭하여 업로드하세요</p>
                  <Button variant="outline" size="sm" className="mt-3" type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    이미지 선택
                  </Button>
                </label>
              </div>
            )}
          </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>트렌드 차트</CardTitle>
          <CardDescription>신호 데이터 트렌드 분석</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <TrendChart signalId={signalId} title={`${signalId} 트렌드 분석`} />
        </CardContent>
      </Card>
    </div>
  )
}
