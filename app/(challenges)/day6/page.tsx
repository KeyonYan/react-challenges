'use client'
import {Card} from "@/components/Card/Card";
import { useState } from "react";

const Day6 = () => {
  const [cardHeight, setCardHeight] = useState(300)
  const [cardWidth, setCardWidth] = useState(200)
  const [hover, setHover] = useState(false)
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 6</h1>
      <div className="text-2xl font-bold">Resizable Card</div>
      <div className="flex flex-row">
        <Card height={cardHeight} width={cardWidth} hover={hover} onCardHover={setHover} onChangeHeight={setCardHeight} onChangeWidth={setCardWidth}/>
      </div>
    </div>
  )
}

export default Day6;