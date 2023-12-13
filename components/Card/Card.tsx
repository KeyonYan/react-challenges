import { cn } from "@/lib/utils"
import { Dispatch, HTMLAttributes, MouseEventHandler, SetStateAction, forwardRef, useRef, useState } from "react"

type Axis = 'x' | 'y' | 'xy'

export interface CardHandleProps extends HTMLAttributes<HTMLDivElement> {
  axis: Axis
  hover: boolean
  onCardResize: MouseEventHandler<HTMLDivElement>
  onCardResizeStart: MouseEventHandler<HTMLDivElement>
  onCardResizeEnd: MouseEventHandler<HTMLDivElement>
}

const CardHandle = forwardRef<HTMLDivElement, CardHandleProps>(
  ({className, hover, onResize, onCardResize, onCardResizeStart, onCardResizeEnd, axis, ...props}, ref) => {
    
    const handleBoxStyle = `${axis.includes('y') ? 'bottom-0 w-1/2 h-8 cursor-row-resize' : ''} ${axis.includes('x') ? 'right-0 h-1/2 w-8 cursor-col-resize' : ''}`
    const handleStyle = `${axis.includes('y') ? 'w-1/2 h-1' : ''} ${axis.includes('x') ? 'h-1/2 w-1' : ''}`
    if (axis === 'xy') {
      return (
        <div
          ref={ref}
          onMouseMove={onCardResize}
          onMouseDown={onCardResizeStart}
          onMouseUp={onCardResizeEnd}
          className='cursor-nwse-resize absolute bottom-0 right-0 flex justify-center items-center w-1/5 h-1/5'
        >
        </div>
      )
    }
    return (
      <div
        ref={ref}
        onMouseMove={onCardResize}
        onMouseDown={onCardResizeStart}
        onMouseUp={onCardResizeEnd}
        className={cn(hover ? 'opacity-100' : 'opacity-0', handleBoxStyle, 'absolute flex items-center justify-center')}
      >
        <div className={cn(handleStyle, 'transition-opacity duration-2000 ease-in rounded-lg bg-[#6f6f6f]')}></div>
      </div>
    )
  }
)

CardHandle.displayName = 'CardHandle'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  height: number
  width: number
  hover: boolean
  onCardHover: (hover: boolean) => void
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, height, width, hover, onCardHover, ...props}, ref) => {
    return (
      <div
        ref={ref}
        style={{height: height, width: width}}
        className={cn('w-60 rounded-lg border bg-card text-card-foreground shadow-sm flex justify-center items-center relative', className)}
        {...props}
        onMouseEnter={() => onCardHover(true)}
        onMouseLeave={() => onCardHover(false)}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export interface ResizableBoxProps extends HTMLAttributes<HTMLDivElement> {
  height: number
  width: number
  setHeight: (height: number) => void
  setWidth: (width: number) => void
}

export const ResizableBox = forwardRef<HTMLDivElement, ResizableBoxProps>(
  ({className, children, height, width, setHeight, setWidth, ...props}, ref) => {
    const [hover, setHover] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const handleResizeStart: MouseEventHandler<HTMLDivElement> = (e) => {
      setIsDragging(true)
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
    }
    const handleResizeEnd: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      setIsDragging(false)
    }
    const handleHeightResize: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      const diffY = e.clientY - mousePos.y
      const newHeight = height + diffY;
      setHeight(newHeight)
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
    }
    const handleWidthResize: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      const diffX = e.clientX - mousePos.x;
      const newWidth = width + diffX;
      setWidth(newWidth)
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
    }
    const handleHWResize: MouseEventHandler<HTMLDivElement> = (e) => {
      handleHeightResize(e)
      handleWidthResize(e)
    }
    return (
      <div className={cn(className)}>
        <Card
          height={height}
          width={width}
          hover={hover}
          onCardHover={(h) => setHover(h)}
        >
          <CardHandle hover={hover} axis='y' onCardResize={handleHeightResize} onCardResizeStart={handleResizeStart} onCardResizeEnd={handleResizeEnd} />
          <CardHandle hover={hover} axis='x' onCardResize={handleWidthResize} onCardResizeStart={handleResizeStart} onCardResizeEnd={handleResizeEnd} />
          <CardHandle hover={hover} axis='xy' onCardResize={handleHWResize} onCardResizeStart={handleResizeStart} onCardResizeEnd={handleResizeEnd} />
        </Card>
      </div>
    )
  }
)

ResizableBox.displayName = 'ResizableBox'