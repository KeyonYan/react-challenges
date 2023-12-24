import { PanInfo, motion, useMotionValue, useSpring } from "framer-motion"
import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react"

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

export interface MutableViewProps extends HTMLAttributes<HTMLDivElement> {
  rect: Rect
  fixed?: boolean
  onRectChange: (rect: Rect) => void
}
export const MutableView = forwardRef<HTMLDivElement, MutableViewProps>(
  ({className, children, rect, onRectChange, fixed, ...props}, ref) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [mutAreaSize, setMutAreaSize] = useState({ w: 0, h: 0})
    const w = useSpring(rect.w)
    const h = useSpring(rect.h)
    const x = useMotionValue(rect.x)
    const y = useMotionValue(rect.y)
    
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
    }, [rect])

    const handleRectChange = () => {
      const newRect = {
        x: x.get(),
        y: y.get(),
        w: w.get(),
        h: h.get()
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
      <motion.div 
        ref={rootRef}
        className='absolute'
        style={{
          x,
          y,
          width: w, 
          height: h
        }} 
        whileHover={{ scale: 1.1 }}
        drag={!fixed}
        onDrag={handleRectChange}
        onTransitionEnd={handleRectChange}
        dragConstraints={dragConstraints}
        dragMomentum={false}
      >
        {children}
      </motion.div>
    )
  }
)

MutableView.displayName = 'MutableView'