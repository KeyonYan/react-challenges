'use client'

import { MutableView, Rect } from "@/components/MutableView/MutableView"
import { motion } from "framer-motion"
import { useState } from "react"
import GirlImage from '@/public/image/girl.png'
import Image from "next/image"

type MutViewType = 'image' | 'video' | 'webpage' | 'audio'

const Day9 = () => {
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 9</h1>
      <div className="text-2xl font-bold">Mutable Desktop</div>
      <motion.div layout className='relative w-screen h-screen'>
        <ImageMutableView />  
      </motion.div>
    </div>
  )
}

const ImageMutableView = () => {
  const [rect, setRect] = useState<Rect>({x: 0, y: 0, w: 200, h: 280})
  return (
    <MutableView className='border rounded-lg shadow-sm overflow-hidden' rect={rect} onRectChange={(setRect)}>
      <Image className='border rounded-lg' layout='fill' src={GirlImage} alt='girl image' draggable='false'/>
    </MutableView>
  )
}

export default Day9