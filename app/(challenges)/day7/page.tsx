'use client'
import { DraggableBox } from "@/components/DraggableBox/DraggableBox";
import { ResizableCard } from "@/components/ResizableCard/ResizableCard";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useLayoutEffect, useRef, useState } from "react";

const Day7 = () => {
  const [firstCardHeight, setFirstCardHeight] = useState(300)
  const [firstCardWidth, setFirstCardWidth] = useState(200)
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 7</h1>
      <div className="text-2xl font-bold">Draggable Card</div>
      <DraggableBox>
        <ResizableCard height={firstCardHeight} width={firstCardWidth} onChangeHeight={setFirstCardHeight} onChangeWidth={setFirstCardWidth}>
          <GitHubLogoIcon className='w-10 h-10' />
        </ResizableCard>
        <ResizableCard height={firstCardHeight} width={firstCardWidth} onChangeHeight={setFirstCardHeight} onChangeWidth={setFirstCardWidth}>
          <GitHubLogoIcon className='w-10 h-10' />
        </ResizableCard>
        <ResizableCard height={firstCardHeight} width={firstCardWidth} onChangeHeight={setFirstCardHeight} onChangeWidth={setFirstCardWidth}>
          <GitHubLogoIcon className='w-10 h-10' />
        </ResizableCard>
      </DraggableBox>
    </div>
  )
}

export default Day7;