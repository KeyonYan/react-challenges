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
    const resizerLen = 15
    const resizerX = useMotionValue(rect.x + rect.w - resizerLen)
    const resizerY = useMotionValue(rect.y + rect.h - resizerLen)
    
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
          className='absolute cursor-move'
          style={{
            x,
            y,
            width: w,
            height: h
          }} 
          whileHover={{ scale: 1.1 }}
          drag={!fixed}
          onDrag={handleRectChange}
          dragConstraints={dragConstraints}
          dragMomentum={false}
          dragElastic={false}
          dragPropagation
        >
          {children}
        </motion.div>
        
        {
          !fixed && 
          <motion.div
            className='absolute w-[15px] h-[15px] rounded-md bg-[#6f6f6f] cursor-nwse-resize'
            drag
            style={{
              x: resizerX,
              y: resizerY
            }}
            dragConstraints={{
              left: 0,
              top: 0,
              right: mutAreaSize.w - resizerLen,
              bottom: mutAreaSize.h - resizerLen,
            }}
            onDrag={(e, info) => handleResizer(e, info)}
            onDragEnd={(e, info) => handleResizer(e, info)}
            dragMomentum={false}
            dragElastic={false}
          >
          </motion.div>
        }
      </>
    )
  }
)

MutableView.displayName = 'MutableView'