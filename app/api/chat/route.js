import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, history, systemPrompt } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY
    const provider = process.env.AI_PROVIDER || 'anthropic'

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'No hay API key configurada. Configura ANTHROPIC_API_KEY u OPENAI_API_KEY en las variables de entorno.' 
      }, { status: 500 })
    }

    let response

    if (provider === 'anthropic') {
      response = await callAnthropic(message, history, systemPrompt, apiKey)
    } else {
      response = await callOpenAI(message, history, systemPrompt, apiKey)
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function callAnthropic(message, history, systemPrompt, apiKey) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    })),
    { role: 'user', content: message }
  ]

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages
    })
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Anthropic API error: ${error}`)
  }

  const data = await res.json()
  return data.content[0].text
}

async function callOpenAI(message, history, systemPrompt, apiKey) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.filter(m => m.role !== 'system'),
    { role: 'user', content: message }
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 4096
    })
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}
