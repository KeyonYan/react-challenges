'use client'

import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef, useState } from "react"

const bingImgUrl = 'https://bing.img.run/rand.php'

export default function ScrollDisplayPage() {
  const container = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  const styleSet = [
    {
      scale: useTransform(scrollYProgress, [0, 1], [1, 0.8]),
      rotate: useTransform(scrollYProgress, [0, 1], [0, -5])
    },
    {
      scale: useTransform(scrollYProgress, [0, 1], [0.8, 1]),
      rotate: useTransform(scrollYProgress, [0, 1], [-5, 0])
    },
  ]

  return (
    <div ref={container} className="relative">
      <ScrollItem itemStyle={styleSet[0]} className="sticky top-0" />
      <ScrollItem itemStyle={styleSet[1]} className="relative" />
    </div>
  )
}


interface ScrollItem {
  itemStyle: any,
  className?: string
}

const ScrollItem = ({ itemStyle, className }: ScrollItem) => {
  const randomIndex = Math.random()
  return (
    <motion.div className={className} style={ itemStyle }>
      <Image src={`${bingImgUrl}?${randomIndex}`} alt={`${randomIndex}`}/>
    </motion.div>
  )
}

