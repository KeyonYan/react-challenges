'use client'
import { useState } from "react"

// https://reactchallenges.live/challenge/1
// Challenge: Show/Hide title
export default function Day1() {
  const [show, setShow] = useState(false)
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 1</h1>

      <div className="flex flex-row gap-2">
        <button onClick={() => setShow(!show)} className="text-lg rounded-lg p-1 bg-slate-300">Show / Hide</button>
        {show && <div className="text-2xl font-bold">Welcome to React Challenges</div>}
      </div>
    </div>
  )
}