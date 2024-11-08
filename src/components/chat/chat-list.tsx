import { Message } from 'ai/react'
import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage } from '../ui/avatar'
import { ChatProps } from './chat'
import Image from 'next/image'
import { INITIAL_QUESTIONS } from '@/utils/initial-questions'
import { Button } from '../ui/button'
import ChatMessage from './chat-message'

export default function ChatList({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  loadingSubmit,
  formRef,
  isMobile
}: ChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [name, setName] = React.useState<string>('')
  const [localStorageIsLoading, setLocalStorageIsLoading] = React.useState(true)
  const [initialQuestions, setInitialQuestions] = React.useState<Message[]>([])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const username = localStorage.getItem('ollama_user')
    if (username) {
      setName(username)
      setLocalStorageIsLoading(false)
    }
  }, [])

  const onClickQuestion = (value: string, e: React.MouseEvent) => {
    e.preventDefault()

    handleInputChange({
      target: { value }
    } as React.ChangeEvent<HTMLTextAreaElement>)

    setTimeout(() => {
      formRef.current?.dispatchEvent(
        new Event('submit', {
          cancelable: true,
          bubbles: true
        })
      )
    }, 1)
  }

  // messages.map((m) => console.log(m.experimental_attachments))

  if (messages.length === 0) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <div className='relative flex flex-col gap-4 items-center justify-center w-full h-full'>
          <div className='flex flex-col gap-4 items-center'>
            <div className='flex mx-2 mb-6 mt-2 gap-2 items-center opacity-50'>
              <Image
                src='/munichi_logo.webp'
                alt='AI'
                width={60}
                height={60}
                className='h-20 w-14 object-contain  select-none'
              />
              <h1 className='text-2xl font-bold text-primary font-frances select-none'>
                ChatMPCH
              </h1>
              <span className='font-exo rounded-xl select-none font-xs px-1.5 py-0.5 text-xs uppercase text-yellow-800 font-bold bg-yellow-500'>
                Beta
              </span>
            </div>
            <p className='text-center text-lg text-muted-foreground font-exo font-medium'>
              ¿Cómo puedo ayudarte?
            </p>
          </div>

          <div className='absolute bottom-0 w-full px-4 sm:max-w-3xl grid gap-2 sm:grid-cols-2 sm:gap-4 text-sm font-exo'>
            {/* Only display 4 random questions */}
            {initialQuestions.length > 0 &&
              initialQuestions.map((message) => {
                const delay = Math.random() * 0.25

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                    transition={{
                      opacity: { duration: 0.1, delay },
                      scale: { duration: 0.1, delay },
                      y: { type: 'spring', stiffness: 100, damping: 10, delay }
                    }}
                    key={message.content}
                  >
                    <Button
                      key={message.content}
                      type='button'
                      variant='outline'
                      className='sm:text-start px-4 py-8 flex w-full justify-center sm:justify-start items-center text-sm whitespace-pre-wrap'
                      onClick={(e) => onClickQuestion(message.content, e)}
                    >
                      {message.content}
                    </Button>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      id='scroller'
      className='w-full overflow-y-scroll overflow-x-hidden h-full justify-end'
    >
      <div className='w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end'>
        {messages.map((message, index) => (
          // <motion.div
          //   key={index}
          //   layout
          //   initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
          //   animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          //   exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
          //   transition={{
          //     opacity: { duration: 0.1 },
          //     layout: {
          //       type: 'spring',
          //       bounce: 0.3,
          //       duration: messages.indexOf(message) * 0.05 + 0.2
          //     }
          //   }}
          //   className={cn(
          //     'flex flex-col gap-2 p-4 whitespace-pre-wrap',
          //     message.role === 'user' ? 'items-end' : 'items-start'
          //   )}
          // >
          //   <div className='flex gap-3 items-center'>
          //     {message.role === 'user' && (
          //       <div className='flex items-end gap-3'>
          //         <div className='flex flex-col gap-2 bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto font-exo'>
          //           <div className='flex gap-2'>
          //             {message.experimental_attachments
          //               ?.filter((attachment) =>
          //                 attachment.contentType?.startsWith('image/')
          //               )
          //               .map((attachment, index) => (
          //                 <Image
          //                   key={`${message.id}-${index}`}
          //                   src={attachment.url}
          //                   width={200}
          //                   height={200}
          //                   alt='attached image'
          //                   className='rounded-md object-contain font-exo'
          //                 />
          //               ))}
          //           </div>
          //           <p className='text-end'>{message.content}</p>
          //         </div>
          //         <Avatar className='flex justify-start items-center overflow-hidden'>
          //           <AvatarImage
          //             src='/'
          //             alt='user'
          //             width={6}
          //             height={6}
          //             className='object-contain'
          //           />
          //           <AvatarFallback>
          //             {name && name.substring(0, 2).toUpperCase()}
          //           </AvatarFallback>
          //         </Avatar>
          //       </div>
          //     )}
          //     {message.role === 'assistant' && (
          //       <div className='flex items-end gap-2 '>
          //         <Avatar className='flex justify-start items-center'>
          //           <AvatarImage
          //             src='/munichi_logo.webp'
          //             alt='AI'
          //             width={6}
          //             height={6}
          //             className='object-contain dark:invert'
          //           />
          //         </Avatar>
          //         <span className='bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto font-exo'>
          //           {/* Check if the message content contains a code block */}
          //           {message.content.split('```').map((part, index) => {
          //             if (index % 2 === 0) {
          //               return (
          //                 <Markdown key={index} remarkPlugins={[remarkGfm]}>
          //                   {part}
          //                 </Markdown>
          //               )
          //             } else {
          //               return (
          //                 <pre className='whitespace-pre-wrap' key={index}>
          //                   <CodeDisplayBlock code={part} lang='' />
          //                 </pre>
          //               )
          //             }
          //           })}
          //           {isLoading &&
          //             messages.indexOf(message) === messages.length - 1 && (
          //               <span className='animate-pulse' aria-label='Typing'>
          //                 ...
          //               </span>
          //             )}
          //         </span>
          //       </div>
          //     )}
          //   </div>
          // </motion.div>
          <ChatMessage
            key={message.id || index}
            message={message}
            index={index}
            isLast={index === messages.length - 1}
            isLoading={isLoading}
            name={name}
            messagesLength={messages.length}
          />
        ))}
        {loadingSubmit && (
          <div className='flex pl-4 pb-4 gap-2 items-center'>
            <Avatar className='flex justify-start items-center'>
              <AvatarImage
                src='/munichi_logo.webp'
                alt='ChatMPCH'
                width={6}
                height={6}
                className='object-contain '
              />
            </Avatar>
            <div className='bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto'>
              <div className='flex gap-1'>
                <span className='size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300'></span>
                <span className='size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300'></span>
                <span className='size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300'></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id='anchor' ref={bottomRef}></div>
    </div>
  )
}
