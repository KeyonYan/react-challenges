'use client'
import { DraggableArea, DraggableBox } from "@/components/DraggableBox/DraggableBox";
import { ResizableCard } from "@/components/ResizableCard/ResizableCard";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useLayoutEffect, useRef, useState } from "react";

const Day7 = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 7</h1>
      <div className="text-2xl font-bold">Draggable Card</div>
      <DraggableArea className='w-[500px] h-[500px] rounded-lg border shadow-sm'>
        <div className="p-4">DraggableArea</div>
        <DraggableBox>
          <ResizableCard className='h-[300px] w-[200px] bg-red-100 min-w-[60px] min-h-[60px]'>
            <GitHubLogoIcon className='w-10 h-10' />
          </ResizableCard>
        </DraggableBox>
        <DraggableBox>
          <ResizableCard className='h-[300px] w-[200px] text-4xl bg-blue-100 min-w-[60px] min-h-[60px]'>
            😁
          </ResizableCard>
        </DraggableBox>
      </DraggableArea>
    </div>
  )
}

export default Day7;