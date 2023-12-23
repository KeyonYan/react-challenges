import { motion, useDragControls, useSpring } from "framer-motion"
import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react"

export type ViewSize = {
  x: number,
  y: number,
  w: number,
  h: number,
}

export interface MutableViewProps extends HTMLAttributes<HTMLDivElement> {
  size: ViewSize
  fixable?: BooleanConstructor
}
export const MutableView = forwardRef<HTMLDivElement, MutableViewProps>(
  ({className, children, size, fixable, ...props}, ref) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [mutAreaSize, setMutAreaSize] = useState({ w: 0, h: 0})
    const controls = useDragControls()
    const w = useSpring(size.w)
    const h = useSpring(size.h)

    useEffect(() => {
      const rootElement = rootRef.current
      const mutableArea = rootElement?.parentElement
      if (!mutableArea) return
      const { width: areaWidth, height: areaHeight } = mutableArea.getBoundingClientRect()
      setMutAreaSize({w: areaWidth, h: areaHeight})
    }, [children])

    useEffect(() => {
      w.set(size.w)
      h.set(size.h)
    }, [size])
    
    const dragConstraints = {
      left: 0,
      top: 0,
      right: mutAreaSize.w-size.w,
      bottom: mutAreaSize.h-size.h,
    };
    return (
      <motion.div 
        ref={rootRef}
        className='relative'
        style={{x: size.x, y: size.y, width: w, height: h}} 
        whileHover={{ scale: 1.1 }}
        drag={!fixable}
        dragConstraints={dragConstraints} 
        dragControls={controls}
        dragMomentum={false}
        touch-action
      >
        
        {children}
      </motion.div>
    )
  }
)

MutableView.displayName = 'MutableView'