'use client'
import { ResizableCard, Card } from "@/components/ResizableCard/ResizableCard";
import { GitHubLogoIcon, DiscordLogoIcon, CodeSandboxLogoIcon } from '@radix-ui/react-icons'

const Day6 = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 6</h1>
      <div className="text-2xl font-bold">Resizable Card</div>
      <div className="flex flex-row gap-4">
        <ResizableCard className='w-[200px] h-[300px] min-w-[60px] min-h-[60px]'>
          <GitHubLogoIcon className='w-10 h-10' />
        </ResizableCard>
        <ResizableCard className='w-[200px] h-[300px] bg-[#cbcdff] min-w-[60px] min-h-[60px]'>
          <DiscordLogoIcon className='w-10 h-10' color='#5560ee' />
        </ResizableCard>
        <ResizableCard className='w-[200px] h-[300px] bg-[#e4fc82] min-w-[60px] min-h-[60px]'>
          <CodeSandboxLogoIcon className='w-10 h-10' />
        </ResizableCard>
      </div>
    </div>
  )
}

export default Day6;