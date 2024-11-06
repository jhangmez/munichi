import { createOllama } from 'ollama-ai-provider'
import { streamText, convertToCoreMessages, UserContent } from 'ai'
import { codeBlock } from 'common-tags'
import { maxMessageContext } from '@/lib/tools'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Destructure request data
  const { messages, selectedModel } = await req.json()

  const initialMessages = messages.slice(0, -1)
  const currentMessage = messages[messages.length - 1]

  const ollama = createOllama({})

  // Build message content array directly
  const messageContent: UserContent = [
    { type: 'text', text: currentMessage.content }
  ]
  try {
    // Stream text using the ollama model
    const result = await streamText({
      system: codeBlock`Eres un chatbot de la municipalidad provincial de chiclayo en lambayeque Perú. Respondes preguntas a ciudadanos sobre: 1) El Reglamento de organización y Funciones(ROF) y Texto Unico de Procedimientos Administrativos(TUPA), 2) Autoridades, personas clave, procedimientos administrativos y maneras de contactarse con las diversas autoridades y sedes, 3) Todas las diversas directivas, plan de acondicionamiento territorial, plan de desarrollo que se han realizado dentro de la municipalidad.
    `,
      model: ollama(selectedModel),
      messages: [
        ...convertToCoreMessages(initialMessages),
        { role: 'user', content: messageContent.slice(-maxMessageContext) }
      ],
      abortSignal: AbortSignal.timeout(20000),
      maxTokens: 2800
    })
    return result.toDataStreamResponse()
  } catch (error) {
    return new Response(`Tiempo de respuesta excedido(20s)`, {
      status: 408
    })
  }
}
