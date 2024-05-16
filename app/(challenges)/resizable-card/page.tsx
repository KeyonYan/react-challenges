'use client'
import { ResizableCard, CardSize } from "@/components/ResizableCard";
import { GitHubLogoIcon, DiscordLogoIcon, CodeSandboxLogoIcon } from '@radix-ui/react-icons'
import { useState } from "react";

export default function ResizableCardPage() {
  const [firstCardSize, setFirstCardSize] = useState<CardSize>({h: 300, w: 200})
  const [secondCardSize, setSecondCardSize] = useState<CardSize>({h: 300, w: 200})
  const [thirdCardSize, setThirdCardSize] = useState<CardSize>({h: 300, w: 200})
  return (
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
  )
}
