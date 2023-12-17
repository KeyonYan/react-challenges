'use client'
import { DraggableArea, DraggableBox } from "@/components/DraggableBox/DraggableBox";
import { ResizableCard, CardSize } from "@/components/ResizableCard/ResizableCard";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const Day7 = () => {
  const [firstCardSize, setFirstCardSize] = useState<CardSize>({h: 300, w: 200})
  const [secondCardSize, setSecondCardSize] = useState<CardSize>({h: 300, w: 200})
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 7</h1>
      <div className="text-2xl font-bold">Draggable Card</div>
      <DraggableArea className='w-[500px] h-[500px] rounded-lg border shadow-sm'>
        <div className="p-4">DraggableArea</div>
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
    </div>
  )
}

export default Day7;