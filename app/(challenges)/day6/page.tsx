'use client'
import { ResizableCard, Card } from "@/components/Card/Card";
import { useState } from "react";
import { GitHubLogoIcon, DiscordLogoIcon, CodeSandboxLogoIcon } from '@radix-ui/react-icons'

const Day6 = () => {
  const [firstCardHeight, setFirstCardHeight] = useState(300)
  const [firstCardWidth, setFirstCardWidth] = useState(200)
  const [secondCardHeight, setSecondCardHeight] = useState(300)
  const [thirdCardWidth, setThirdCardWidth] = useState(200)
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 6</h1>
      <div className="text-2xl font-bold">Resizable Card</div>
      <div className="flex flex-row gap-4">
        <ResizableCard height={firstCardHeight} width={firstCardWidth} onChangeHeight={setFirstCardHeight} onChangeWidth={setFirstCardWidth}>
          <GitHubLogoIcon className='w-10 h-10' />
        </ResizableCard>
        <ResizableCard height={secondCardHeight} width={200} onChangeHeight={setSecondCardHeight} className='bg-[#cbcdff]'>
          <DiscordLogoIcon className='w-10 h-10' color='#5560ee' />
        </ResizableCard>
        <ResizableCard height={300} width={thirdCardWidth} onChangeWidth={setThirdCardWidth} className='bg-[#e4fc82]'>
          <CodeSandboxLogoIcon className='w-10 h-10' />
        </ResizableCard>
      </div>
    </div>
  )
}

export default Day6;