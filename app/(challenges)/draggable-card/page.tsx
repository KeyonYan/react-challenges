'use client'
import { DraggableArea, DraggableBox } from "@/components/DraggableBox";
import { ResizableCard, CardSize } from "@/components/ResizableCard";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function DraggableCardPage() {
  const [firstCardSize, setFirstCardSize] = useState<CardSize>({h: 300, w: 200})
  const [secondCardSize, setSecondCardSize] = useState<CardSize>({h: 300, w: 200})
  return (
    <DraggableArea className='w-[1000px] h-[500px] rounded-lg border shadow-sm'>
      <DraggableBox>
        <ResizableCard size={firstCardSize} min={{h: 60, w: 60}} onChangeSize={setFirstCardSize} className='bg-red-100'>
          <GitHubLogoIcon className='w-10 h-10' />
        </ResizableCard>
      </DraggableBox>
      <DraggableBox>
        <ResizableCard size={secondCardSize} min={{h: 60, w: 60}} onChangeSize={setSecondCardSize} className='text-4xl bg-blue-100'>
          😁
        </ResizableCard>
      </DraggableBox>
    </DraggableArea>
  )
}
