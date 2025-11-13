"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidDiagramProps {
  chart: string
  className?: string
}

let mermaidInitialized = false

export function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")

  useEffect(() => {
    const renderDiagram = async () => {
      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        })
        mermaidInitialized = true
      }

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
      } catch (error) {
        console.error("Mermaid rendering error:", error)
        // Fallback: display as text
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-xs">${chart}</pre>`
        }
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: "flex", justifyContent: "center" }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
