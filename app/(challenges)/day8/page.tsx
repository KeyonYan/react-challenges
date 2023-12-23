'use client'
import { MutableView, ViewSize } from "@/components/MutableView/MutableView"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

const Day8 = () => {
  const [size, setSize] = useState<ViewSize>({x: 0, y: 0, w: 160, h: 160})
  const handleResize = (w: number, h: number) => {
    console.log(`change size: w-${w}px h-${h}px`)
    setSize({x: size.x, y: size.y, w, h})
  }
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 8</h1>
      <div className="text-2xl font-bold">Mutable View</div>
      <div className='flex flex-row gap-2'>
        <Button onClick={() => handleResize(80, 80)}>1x1</Button>
        <Button onClick={() => handleResize(80, 160)}>1x2</Button>
        <Button onClick={() => handleResize(160, 160)}>2x2</Button>
      </div>
      <motion.div layout className='w-[500px] h-[500px] bg-red-100'>
        <MutableView size={size}>
          <div className='w-full h-full align-middle bg-blue-100 rounded-lg shadow-sm flex justify-center items-center text-6xl'>
            📽️
          </div>
        </MutableView>
      </motion.div>
    </div>
  )
}

export default Day8