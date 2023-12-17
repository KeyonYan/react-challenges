'use client'
import Link from 'next/link' 
import { useState } from 'react'

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from '@/components/ResizableCard/ResizableCard'
 
type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false)
  const [showPanel, setShowPanel] = useState<Checked>(false)
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          disabled
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
        >
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-5">
      <div className='text-3xl'>React Challenges</div>
      <div className='grid grid-flow-row-dense grid-cols-5 grid-rows-5 gap-4'>
        <Link href="/challenges/day1">
          <Card className='p-4'>Show / Hide</Card>
        </Link>
        <Link href="/challenges//day2">
          <Card className='p-4'>Timer</Card>
        </Link>
        <Link href="/challenges//day3">
          <Card className='p-4'>Todo list</Card>
        </Link>
        <Link href="/challenges//day5">
          <Card className='p-4'>ProgressBar</Card>
        </Link>
        <Link href="/challenges//day6">
          <Card className='p-4'>Nextjs Router handler & fetch</Card>
        </Link>
        <Link href="/challenges//day7">
          <Card className='p-4'>Resizable Card</Card>
        </Link>
        <Link href="/challenges//day7">
          <Card className='p-4'>Draggable Card</Card>
        </Link>
      </div>
    </main>
  )
}
