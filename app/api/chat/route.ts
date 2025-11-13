import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const apiUrl = process.env.MISO_API_URL
    const apiKey = process.env.MISO_API_KEY

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Miso API 설정이 필요합니다. .env.local에 MISO_API_URL과 MISO_API_KEY를 설정하세요.' },
        { status: 500 }
      )
    }

    // 마지막 사용자 메시지 추출
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()
    const query = lastUserMessage?.content || '안녕하세요'

    // 전체 대화 내역을 컨텍스트로 포함
    const conversationHistory = messages
      .map((m: any) => `${m.role === 'user' ? '사용자' : 'AI'}: ${m.content}`)
      .join('\n\n')

    // 요청 페이로드 생성
    const payload = {
      inputs: {},
      query: query,
      mode: 'blocking',
      conversation_id: '',
      user: `user_${Date.now()}`
    }

    console.log('Miso API Request:', JSON.stringify(payload, null, 2))

    // Miso API 호출 (Chat 앱)
    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Miso API Error:', errorData)
      return NextResponse.json(
        { error: `Miso API 오류: ${response.status} ${response.statusText}`, details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Miso API Response:', JSON.stringify(data, null, 2))

    // Miso API 응답 처리
    // Completion 앱 응답에서 메시지 추출
    let assistantMessage = '응답을 받을 수 없습니다.'

    if (data.answer) {
      // completion-messages 형식
      assistantMessage = data.answer
    } else if (data.data?.outputs) {
      // workflow 형식 폴백
      const outputs = data.data.outputs
      assistantMessage = outputs.text || outputs.answer || outputs.result || assistantMessage
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sources: [], // 나중에 RAG 응답에서 추출
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: 'AI 응답 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
