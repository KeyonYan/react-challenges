'use client'
import {Card} from "@/components/Card/Card";
import { useState } from "react";
import { GitHubLogoIcon, DiscordLogoIcon, CodeSandboxLogoIcon } from '@radix-ui/react-icons'

const Day6 = () => {
  const [cardHeight, setCardHeight] = useState(300)
  const [cardWidth, setCardWidth] = useState(200)
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 6</h1>
      <div className="text-2xl font-bold">Resizable Card</div>
      <div className="flex flex-row gap-4">
        <Card height={cardHeight} width={cardWidth} onChangeHeight={setCardHeight} onChangeWidth={setCardWidth}>
          <GitHubLogoIcon className='w-10 h-10' />
        </Card>
        <Card height={300} width={200} className='bg-[#cbcdff]'>
          <DiscordLogoIcon className='w-10 h-10' color='#5560ee' />
        </Card>
        <Card height={300} width={200} className='bg-[#e4fc82]'>
          <CodeSandboxLogoIcon className='w-10 h-10' />
        </Card>
      </div>
    </div>
  )
}

export default Day6;