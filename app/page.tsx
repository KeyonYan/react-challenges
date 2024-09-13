'use client'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { LogosReactMotion } from './icons/Icons'
import { motion, useAnimate } from 'framer-motion'
import { useState } from 'react'

let isRotating = false
export default function Home() {
  const [scope, animate] = useAnimate()
  const [speed, setSpeed] = useState(1)
  const handleIconClick = () => {
    if (isRotating) return
    isRotating = true
    animate(scope.current, { rotate: 360 }, { duration: 1 / speed })
      .then(() => {
        animate(scope.current, { rotate: 0 }, { duration: 0 })
        isRotating = false
      })
    setSpeed(speed => speed + 0.1)
  }
  const animateString = (str: string) => {
    return str.split('').map((rune, index) => {
      return {
        rune: rune,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: index * 0.1 }
      }
    })
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-5">
      <h1 className='text-2xl select-none flex flex-col items-center gap-3'>
        <div className='flex flex-row items-center gap-3'>
          <div className='flex gap-1'>
            {animateString('React').map((el, i) => {
              return <motion.span className='p-0' key={String(i)} {...el} transition={{ delay: i * 0.1 }}>{el.rune}</motion.span>
            })}
          </div>
          <LogosReactMotion ref={scope} onClick={handleIconClick} className='overflow-visible w-12 h-12' />
        </div>
        <div className='flex gap-1'>
          {animateString('Challenge').map((el, i) => {
            return <motion.span key={String(i)} {...el} transition={{ delay: i * 0.1 }}>{el.rune}</motion.span>
          })}
        </div>
      </h1>
      <div className='grid grid-flow-row-dense sm:grid-cols-1 md:grid-cols-5 grid-rows-5 gap-4'>
        <Link href="/timer">
          <Card className='p-4'>Timer</Card>
        </Link>
        <Link href="/todo-list">
          <Card className='p-4'>Todo list</Card>
        </Link>
        <Link href="/progressbar">
          <Card className='p-4'>ProgressBar</Card>
        </Link>
        <Link href="/nextjs/router-handler">
          <Card className='p-4'>Nextjs Router handler & fetch</Card>
        </Link>
        <Link href="/resizable-card">
          <Card className='p-4'>Resizable Card</Card>
        </Link>
        <Link href="/draggable-card">
          <Card className='p-4'>Draggable Card</Card>
        </Link>
        <Link href="/framer-motion/mutable-view">
          <Card className='p-4'>Mutable View</Card>
        </Link>
        <Link href="/virtual-list">
          <Card className='p-4'>Virtual List</Card>
        </Link>
        <Link href="/framer-motion/scroll-progress">
          <Card className='p-4'>Scroll Progess</Card>
        </Link>
        <Link href="/framer-motion/scroll-display">
          <Card className='p-4'>Scroll Display</Card>
        </Link>
        <Link href="/app-layout">
          <Card className='p-4'>App Layout</Card>
        </Link>
        <Link href="/novel-web/xyflow">
          <Card className='p-4'>React Flow</Card>
        </Link>
        <Link href="/react-grid-layout">
          <Card className='p-4'>React Grid Layout</Card>
        </Link>
      </div>
    </main>
  )
}
