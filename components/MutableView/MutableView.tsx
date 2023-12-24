import { PanInfo, motion, useMotionValue, useSpring } from "framer-motion"
import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react"
import {ClarityDragHandleCornerLine} from '@/app/icons/Icons'
import { cn } from "@/lib/utils"

export type Rect = {
  x: number,
  y: number,
  w: number,
  h: number,
}

export type Size = {
  w: number,
  h: number
}

let maxZIndex = 1

export interface MutableViewProps extends HTMLAttributes<HTMLDivElement> {
  rect: Rect
  fixed?: boolean
  onRectChange: (rect: Rect) => void
}
export const MutableView = forwardRef<HTMLDivElement, MutableViewProps>(
  ({className, children, rect, onRectChange, fixed, ...props}, ref) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const resizerRef = useRef<HTMLDivElement>(null)
    const [mutAreaSize, setMutAreaSize] = useState({ w: 0, h: 0})
    const w = useSpring(rect.w)
    const h = useSpring(rect.h)
    const x = useMotionValue(rect.x)
    const y = useMotionValue(rect.y)
    const resizerLen = 20
    const resizerX = useMotionValue(rect.x + rect.w - resizerLen)
    const resizerY = useMotionValue(rect.y + rect.h - resizerLen)
    const resizerScale = useMotionValue(1)
    
    useEffect(() => {
      const rootElement = rootRef.current
      const mutableArea = rootElement?.parentElement
      if (!mutableArea) return
      const { width: areaWidth, height: areaHeight } = mutableArea.getBoundingClientRect()
      setMutAreaSize({w: areaWidth, h: areaHeight})
    }, [children])

    useEffect(() => {
      w.set(rect.w)
      h.set(rect.h)
      x.set(rect.x)
      y.set(rect.y)
      resizerX.set(rect.x + rect.w - resizerLen)
      resizerY.set(rect.y + rect.h - resizerLen)
    }, [rect])
    const handleDragStart = () => {
      if (rootRef.current && resizerRef.current) {
        rootRef.current.style.zIndex = String(maxZIndex)
        resizerRef.current.style.zIndex = String(maxZIndex)
        maxZIndex++
      }
    }
    const handleRectChange = () => {
      const newRect = {
        x: x.get(),
        y: y.get(),
        w: w.get(),
        h: h.get()
      }
      onRectChange(newRect)
    }
    const handleResizer = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const newRect = {
        x: x.get(),
        y: y.get(),
        w: resizerX.get() - x.get() + resizerLen,
        h: resizerY.get() - y.get() + resizerLen,
      }
      onRectChange(newRect)
    }
    const dragConstraints = {
      left: 0,
      top: 0,
      right: mutAreaSize.w-rect.w,
      bottom: mutAreaSize.h-rect.h,
    };
    return (
      <>
        <motion.div
          ref={rootRef}
          className={cn(className, 'absolute cursor-move')}
          style={{
            x,
            y,
            width: w,
            height: h,
          }}
          whileHover={{scale: 1.1}}
          onHoverStart={() => resizerScale.set(1.3)}
          onHoverEnd={() => resizerScale.set(1)}
          drag={!fixed}
          onDragStart={handleDragStart}
          onDrag={handleRectChange}
          dragConstraints={dragConstraints}
          dragMomentum={false}
          dragElastic={false}
          dragPropagation
        >
          {children}
        </motion.div>
        
        <motion.div
        ref={resizerRef}
          className={`${fixed ? 'hidden' : ''} absolute rounded-md cursor-nwse-resize`}
          style={{
            x: resizerX,
            y: resizerY,
            width: resizerLen,
            height: resizerLen,
            scale: resizerScale,
          }}
          drag
          dragConstraints={{
            left: rect.x,
            top: rect.y,
            right: mutAreaSize.w - resizerLen,
            bottom: mutAreaSize.h - resizerLen,
          }}
          onDrag={(e, info) => handleResizer(e, info)}
          whileDrag={{opacity: 0}}
          whileHover={{ scale: 1.3, opacity: 100}}
          onDragEnd={(e, info) => handleResizer(e, info)}
          dragMomentum={false}
          dragElastic={false}
        >
          <ClarityDragHandleCornerLine style={{width: resizerLen, height: resizerLen}} />
        </motion.div>
      </>
    )
  }
)

MutableView.displayName = 'MutableView'