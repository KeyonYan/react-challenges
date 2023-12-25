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
      <Image src='https://mqa-photo-1256901694.cos.ap-shanghai.myqcloud.com/e41510df7f.jpg' width={100} height={100} alt='123'/>
      {/* <motion.div layout className='relative w-screen h-screen'>
        <ImageMutableView />
      </motion.div> */}
      {/* <motion.div layout className='relative w-screen h-screen'>
        <AudioMutableView />
      </motion.div> */}
    </div>
  )
}

const ImageMutableView = () => {
  const [rect, setRect] = useState<Rect>({x: 0, y: 0, w: 200, h: 280})
  return (
    <MutableView className='border rounded-lg shadow-sm overflow-hidden' rect={rect} onRectChange={(setRect)}>
      <Image className='border rounded-lg' fill={true} src={GirlImage} alt='girl image' draggable='false'/>
    </MutableView>
  )
}

const AudioMutableView = () => {
  const [rect, setRect] = useState<Rect>({x: 220, y: 0, w: 200, h: 280})
  return (
    <MutableView className='border rounded-lg shadow-sm overflow-hidden' rect={rect} onRectChange={(setRect)}>
      <audio controls className='w-full h-full bg-blue-50'>
        <source src="@/public/audio/Melody.mp3" />
      </audio>
    </MutableView>
  )
}

export default Day9