'use client'
import Link from 'next/link' 
import { Card } from '@/components/ResizableCard/ResizableCard'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-5">
      <div className='text-3xl'>React Challenges</div>
      <div className='grid grid-flow-row-dense grid-cols-5 grid-rows-5 gap-4'>
        <Link href="/day1">
          <Card className='p-4'>Show / Hide</Card>
        </Link>
        <Link href="/day2">
          <Card className='p-4'>Timer</Card>
        </Link>
        <Link href="/day3">
          <Card className='p-4'>Todo list</Card>
        </Link>
        <Link href="/day4">
          <Card className='p-4'>ProgressBar</Card>
        </Link>
        <Link href="/day5">
          <Card className='p-4'>Nextjs Router handler & fetch</Card>
        </Link>
        <Link href="/day6">
          <Card className='p-4'>Resizable Card</Card>
        </Link>
        <Link href="/day7">
          <Card className='p-4'>Draggable Card</Card>
        </Link>
        <Link href="/day8">
          <Card className='p-4'>Mutable View</Card>
        </Link>
      </div>
    </main>
  )
}
