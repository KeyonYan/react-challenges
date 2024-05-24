import { cn } from "@/lib/utils";
import { useMouse } from "@uidotdev/usehooks";
import { motion, MotionProps } from "framer-motion";
import { forwardRef, HTMLAttributes, useRef, useState } from "react";


interface AppLayoutProps extends HTMLAttributes<HTMLDivElement> {
  comps: Comp[]
  unit: number,
  gap: number,
}

export const AppLayout = forwardRef<HTMLDivElement, AppLayoutProps>(
  ({comps, unit, gap, className, children, ...props}, ref) => {
    const [shadow, setShadow] = useState<DragShadowProps>()
    const [compsValue, setCompsValue] = useState(comps)
    const [mouse, layoutRef] = useMouse<HTMLDivElement>()
    const shadowRef = useRef<HTMLDivElement>(null)
    const [isDrag, setIsDrag] = useState(false)
    function handleDrag(e: DragEvent, item: CompProps) {
      const n = Math.floor((mouse.elementY - gap) / (unit + gap))
      const m = Math.floor((mouse.elementX - gap) / (unit + gap))
      setShadow({row: n, col: m, width: item.width, height: item.height})
    }
    function handleDragEnd(e: DragEvent) {
      setIsDrag(false)
    }
    return (
      <div ref={layoutRef} className={cn(className, "relative w-[800px] h-[800px] m-10 border")}>
        <DragShadow ref={shadowRef} {...shadow} />
        {compsValue.map((item, index) => {
          return (
            <Comp
              {...item}
              key={index}
              onDragStart={() => setIsDrag(true)}
              onDrag={(e) => handleDrag(e as DragEvent, item)}
              onDragEnd={handleDragEnd}
              dragConstraints={shadowRef}
            >
              *
            </Comp>
          )
        })}
      </div>
    )
  }
)

AppLayout.displayName = 'AppLayout'

export default AppLayout

const unit = 50, gap = 20

interface Comp {
  row: number,
  col: number,
  width: number,
  height: number
}

interface DragShadowProps extends MotionProps {
  row?: number,
  col?: number,
  width?: number,
  height?: number,
  className?: string
}

const DragShadow = forwardRef<HTMLDivElement, DragShadowProps>(
  ({row = 0, col = 0, width = 0, height = 0, className, ...props}, ref) => {
    return (
      <motion.div
        ref={ref}
        style={{
          top: unit*row + (row+1)*gap, 
          left: unit*col + (col+1)*gap,
          width: unit*width+((width-1)*gap),
          height: unit*height+((height-1)*gap)
        }}
        className={`absolute bg-transparent rounded-lg border z-0`}
        {...props}
      >
      </motion.div>
    )
  }
)

DragShadow.displayName = 'DragShadow'

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
        width: unit*width+((width-1)*gap), 
        height: unit*height+((height-1)*gap),
      }}
      drag
      whileHover={{scale: 1.1}}
      style={{
        top: unit*row + (row+1)*gap,
        left: unit*col + (col+1)*gap
      }}
      className={cn(className, `absolute z-1 bg-cyan-100 rounded-lg border shadow-sm flex justify-center items-center`)}
      {...props}
    >
        {children}
    </motion.div>
  )
}