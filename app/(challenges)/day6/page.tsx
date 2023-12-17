'use client'
import { ResizableCard, Size } from "@/components/ResizableCard/ResizableCard";
import { GitHubLogoIcon, DiscordLogoIcon, CodeSandboxLogoIcon } from '@radix-ui/react-icons'
import { useState } from "react";

const Day6 = () => {
  const [firstCardSize, setFirstCardSize] = useState<Size>({h: 300, w: 200})
  const [secondCardSize, setSecondCardSize] = useState<Size>({h: 300, w: 200})
  const [thirdCardSize, setThirdCardSize] = useState<Size>({h: 300, w: 200})
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 6</h1>
      <div className="text-2xl font-bold">Resizable Card</div>
      <div className="flex flex-row gap-4">
        <ResizableCard size={firstCardSize} min={{h: 60, w: 60}} onChangeSize={setFirstCardSize}>
          <GitHubLogoIcon className='w-10 h-10' />
        </ResizableCard>
        <ResizableCard size={secondCardSize} min={{h: 60, w: 60}} onChangeSize={setSecondCardSize} className='bg-[#cbcdff]'>
          <DiscordLogoIcon className='w-10 h-10' color='#5560ee' />
        </ResizableCard>
        <ResizableCard size={thirdCardSize} min={{h: 60, w: 60}} onChangeSize={setThirdCardSize} fixable className='bg-[#e4fc82]'>
          <CodeSandboxLogoIcon className='w-10 h-10' />
        </ResizableCard>
      </div>
    </div>
  )
}

export default Day6;