'use client'
import { ChangeEventHandler, useState } from "react"
import Progress from "@/components/ProgressBar"

export default function Day4() {
  const [value, setValue] = useState(50)
  const handleChange: ChangeEventHandler<HTMLInputElement>= (e) => {
    const val = Number(e.target.value)
    setValue(Math.max(0, Math.min(val, 100)))
  }
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 4</h1>
      <div className="text-2xl font-bold">Progress Bar</div>
      <Progress value={value} max={100} size='lg' variant='bright'/>
      <div className="flex flex-row gap-4 items-center">
        <div>Input Precentage: </div>
        <input onChange={handleChange} className="rounded-lg p-1 border-2" placeholder="progress value" value={value} min='0' max='100' type='number'></input>
      </div>
    </div>
  )
}