'use client'
import Link from 'next/link' 
import { Card } from '@/components/Card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-5">
      <div className='text-3xl'>React Challenges</div>
      <div className='grid grid-flow-row-dense grid-cols-5 grid-rows-5 gap-4'>
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
      </div>
    </main>
  )
}
