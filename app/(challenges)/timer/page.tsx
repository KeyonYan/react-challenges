'use client'
import { useState } from "react"

export default function TimerPage() {
  const [timer, setTimer] = useState(0)
  const [start, setStart] = useState(false)
  
  const startTimer = () => {
    if (!start) {
      setStart(true)
      window.timerTask = setInterval(() => {
        setTimer((timer) => timer+1)
      }, 1000)
    }
  }

  const stopTimer = () => {
    clearInterval(window.timerTask)
    setStart(false)
  }

  const resetTimer = () => {
    clearInterval(window.timerTask)
    setTimer(0)
    setStart(false)
  }
  return (
    <>
      <div>{Math.trunc(timer/60)} mins {timer % 60} secs</div>
      <div className="flex flex-row gap-2">
        <div className="rounded-lg p-2 bg-green-300" onClick={startTimer}>Start</div>
        <div className="rounded-lg p-2 bg-red-300" onClick={stopTimer}>Stop</div>
        <div className="rounded-lg p-2 bg-yellow-300" onClick={resetTimer}>Reset</div>
      </div>
    </>
  )
}