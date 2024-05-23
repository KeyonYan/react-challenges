'use client'

import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { useMouse } from "@uidotdev/usehooks";
import { DragControls, motion, MotionProps, useDragControls } from "framer-motion";
import { atom, useAtom } from "jotai";
import { DragEventHandler, HTMLAttributes, MouseEventHandler, PointerEventHandler, useRef, useState } from "react";

const BASELEN = 50, GAP = 20

interface Comp {
  row: number,
  col: number,
  width: number,
  height: number
}

const comps = atom([
  {
    row: 0,
    col: 0,
    width: 1,
    height: 1,
  },{
    row: 0,
    col: 1,
    width: 1,
    height: 1,
  },
])


interface DragShadowProps {
  row?: number,
  col?: number,
  width?: number,
  height?: number,
}

export function DragShadow({row = 0, col = 0, width = 0, height = 0, ...props}: DragShadowProps) {
  return (
    <motion.div
      style={{
        top: BASELEN*row + (row+1)*GAP, 
        left: BASELEN*col + (col+1)*GAP,
        width: BASELEN*width+((width-1)*GAP),
        height: BASELEN*height+((height-1)*GAP)
      }}
      className={`absolute bg-transparent rounded-lg border z-0`}
      {...props}
    >
    </motion.div>
  )
}

interface CompProps extends MotionProps {
  width: number,
  height: number,
  row: number
  col: number,
  className?: string,
}

export function Comp({width, height, row, col, className, children, ...props}: CompProps) {
  return (
    <motion.div
      initial={{
        width: BASELEN*width+((width-1)*GAP), 
        height: BASELEN*height+((height-1)*GAP),
      }}
      drag
      whileHover={{scale: 1.1}}
      style={{
        top: BASELEN*row + (row+1)*GAP,
        left: BASELEN*col + (col+1)*GAP
      }}
      className={cn(className, `absolute z-1 bg-cyan-100 rounded-lg border shadow-sm flex justify-center items-center`)}
      {...props}
    >
        {children}
    </motion.div>
  )
}

export default function AppLayoutPage() {
  const [shadow, setShadow] = useState<DragShadowProps>()
  const [compsValue, setCompsValue] = useAtom(comps)
  const [mouse, layoutRef] = useMouse<HTMLDivElement>()
  const [isDrag, setIsDrag] = useState(false)
  function handleDrag(e: DragEvent, item: CompProps) {
    const n = Math.floor((mouse.elementY - GAP) / (BASELEN + GAP))
    const m = Math.floor((mouse.elementX - GAP) / (BASELEN + GAP))
    setShadow({row: n, col: m, width: item.width, height: item.height})
  }
  return (
    <AppLayout ref={layoutRef} className="relative w-[800px] h-[800px] m-10 border">
      {compsValue.map((item, index) => {
        return (
          <Comp
            {...item}
            key={index}
            onDragStart={() => setIsDrag(true)}
            onDrag={(e) => handleDrag(e, item)}
            onDragEnd={() => setIsDrag(false)}
            dragConstraints={layoutRef}
          >
            *
          </Comp>
        )
      })}
      {isDrag && <DragShadow {...shadow} />}
    </AppLayout>
  )
}