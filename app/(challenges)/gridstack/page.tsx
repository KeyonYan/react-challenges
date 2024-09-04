'use client'
import React, { useEffect, useRef, useState } from "react"
import { GridStack } from "gridstack"
import { Button } from "@/components/ui/button"

export default function GridStackPage() {
  const [items, setItems] = useState([{ id: 'item-1' }, { id: 'item-2' }])
  const refs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  if (Object.keys(refs.current).length !== items.length) {
    for (const { id } of items) {
      if (!refs.current[id]) {
        refs.current[id] = React.createRef<HTMLDivElement>();
      }
    }
  }

  useEffect(() => {
    const grid = GridStack.init({
      float: true,
    })
    grid.removeAll(false)
    for (const { id } of items) {
      grid.makeWidget(refs.current[id].current)
    }
  }, [items])

  return (
    <div className="grid-stack w-[100vw] h-[100vh]">
      {items?.map((item, i) => {
        return (
          <div
            ref={refs.current[item.id]}
            key={item.id}
            className='grid-stack-item'
          >
            <div className="grid-stack-item-content">
              <div className="bg-red-500 w-[100px] h-[100px]">
                {item.id}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}