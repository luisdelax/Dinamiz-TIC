import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, history = [], systemPrompt } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY
    const provider = process.env.AI_PROVIDER || 'huggingface'

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'No hay API key configurada. Configura GEMINI_API_KEY en las variables de entorno.' 
      }, { status: 500 })
    }

    let response

    if (provider === 'huggingface') {
      response = await callHuggingFace(message, history, systemPrompt, apiKey)
    } else if (provider === 'gemini') {
      response = await callGemini(message, history, systemPrompt, apiKey)
    } else if (provider === 'anthropic') {
      response = await callAnthropic(message, history, systemPrompt, apiKey)
    } else {
      response = await callOpenAI(message, history, systemPrompt, apiKey)
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat error:', error)
    const errorMsg = error.message || ''
    if (errorMsg.includes('quota') || errorMsg.includes('insufficient_quota') || errorMsg.includes('credit balance') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ response: 'Lo siento, el servicio de IA no está disponible en este momento por falta de crédito en la API. Por favor, contacta al administrador para activar el servicio.' })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function callHuggingFace(message, history, systemPrompt, apiKey) {
  const conversation = [
    { role: 'system', content: systemPrompt || 'Eres un asistente útil que responde en español.' },
    ...history?.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    })),
    { role: 'user', content: message }
  ]

  const model = 'meta-llama/Llama-3.2-1B-Instruct'
  const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: conversation,
      max_tokens: 250,
      temperature: 0.7
    })
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`HuggingFace API error: ${error}`)
  }

  const data = await res.json()
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content
  }
  return data.error || 'Lo siento, no pude generar una respuesta.'
}

async function callGemini(message, history, systemPrompt, apiKey) {
  const contents = [
    ...history?.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ]

  const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents
    })
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}

async function callAnthropic(message, history, systemPrompt, apiKey) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history?.filter(m => m.role !== 'system').map(m => ({
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
    { role: 'system', content: systemPrompt || 'Eres un asistente útil que responde en español.' },
    ...history.filter(m => m.role !== 'system'),
    { role: 'user', content: message }
  ]

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://18.222.197.227:3000',
      'X-Title': 'Dinamiz TIC'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
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
