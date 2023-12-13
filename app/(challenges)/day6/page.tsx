'use client'
import {ResizableBox, Card} from "@/components/Card/Card";
import { useState } from "react";

const Day6 = () => {
  const [cardHeight, setCardHeight] = useState(300)
  const [cardWidth, setCardWidth] = useState(200)
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 6</h1>
      <div className="text-2xl font-bold">Resizable Card</div>
      <ResizableBox className='w-screen h-screen' height={cardHeight} width={cardWidth} setHeight={setCardHeight} setWidth={setCardWidth} />
    </div>
  )
}

export default Day6;