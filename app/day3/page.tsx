'use client'
import { useState, useRef } from "react"

export default function Day3() {
  const [items, setItems] = useState(['a', 'b'])
  const inputElement = useRef<HTMLInputElement>(null)
  const handleAdd = () => {
    if (inputElement.current && inputElement.current.value !== '') {
      setItems([...items, inputElement.current.value])
      inputElement.current.value = ''
    }
  }
  const handleDel = ( index: number ) => {
    const newItems = items.filter((item, i) => i !== index)
    setItems(newItems)
  }
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Day 3</h1>
      <div className="flex flex-row gap-2">
        <input ref={inputElement} placeholder="Add city" className="border-indigo-500 border-2 p-1 rounded-lg" />
        <button onClick={handleAdd} className="rounded-lg bg-slate-200 p-2">Add</button>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => {
            return (
              <div key={index} className="flex flex-row items-center gap-2">
                <div>{index+1}. {item}</div>
                <button onClick={() => handleDel(index)} className="rounded-lg p-1">❌</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}