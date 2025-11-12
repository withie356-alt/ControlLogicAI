import { AppHeader } from "@/components/app-header"
import { AnalysisWorkflow } from "@/components/analysis-workflow"

interface AnalysisPageProps {
  params: Promise<{
    signalId: string
  }>
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { signalId } = await params

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">
      <AppHeader />
      <main className="container mx-auto p-6 flex-1 min-h-0">
        <AnalysisWorkflow signalId={signalId} />
      </main>
    </div>
  )
}
