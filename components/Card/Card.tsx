import { cn } from "@/lib/utils"
import {  Dispatch, DragEventHandler, HTMLAttributes, MouseEventHandler, SetStateAction, forwardRef, useState } from "react"
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

type Axis = 'x' | 'y' | 'xy'

export interface CardHandleProps extends HTMLAttributes<HTMLDivElement> {
  axis: Axis
  hover: boolean
  height: number
  width: number
  onChangeHeight: (newHeight: number) => void
  onChangeWidth: (newHeight: number) => void
}

const CardHandle = forwardRef<HTMLDivElement, CardHandleProps>(
  ({className, hover, axis, height, width, onChangeHeight, onChangeWidth, ...props}, ref) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const resizeBox = (e: MouseEvent) => {
      if (axis.includes('y')) {
        const diffY = e.clientY - mousePos.y
        const newHeight = height + diffY;
        onChangeHeight(newHeight)
        const newMousePos = {x: e.clientX, y: e.clientY}
        setMousePos(newMousePos)
      }
      if (axis.includes('x')) {
        const diffX = e.clientX - mousePos.x;
        const newWidth = width + diffX;
        onChangeWidth(newWidth)
        const newMousePos = {x: e.clientX, y: e.clientY}
        setMousePos(newMousePos)
      }
    }
    const handleResizeStart: MouseEventHandler<HTMLDivElement> = (e) => {
      setIsDragging(true)
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
    }
    const handleResizeEnd: DragEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      setIsDragging(false)
      resizeBox(e)
    }
    const handleResize: DragEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      resizeBox(e)
    }
    const handleBoxStyle = `${axis.includes('y') ? 'bottom-0 w-1/2 h-8 cursor-row-resize flex-row' : ''} ${axis.includes('x') ? 'right-0 h-1/2 w-8 cursor-col-resize flex-col' : ''}`
    const handleStyle = `${axis.includes('y') ? 'w-1/2 h-1 mb-1' : ''} ${axis.includes('x') ? 'h-1/2 w-1 mr-1' : ''}`
    if (axis === 'xy') {
      return (
        <div
          ref={ref}
          draggable
          onDrag={handleResize}
          onDragStart={handleResizeStart}
          onMouseDown={handleResizeStart}
          onDragEnd={handleResizeEnd}
          className='cursor-nwse-resize absolute bottom-0 right-0 flex justify-center items-center w-1/5 h-1/5'
        >
        </div>
      )
    }
    return (
      <div
        ref={ref}
        draggable
        onDrag={handleResize}
        onDragStart={handleResizeStart}
        onMouseDown={handleResizeStart}
        onDragEnd={handleResizeEnd}
        className={cn(hover ? 'opacity-100' : 'opacity-0', handleBoxStyle, 'absolute flex items-end justify-center transition-opacity duration-700 ease-out ')}
      >
        <div className={cn(handleStyle, 'rounded-lg bg-[#6f6f6f]')}></div>
      </div>
    )
  }
)

CardHandle.displayName = 'CardHandle'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  height: number
  width: number
  onChangeHeight: Dispatch<SetStateAction<number>>
  onChangeWidth: Dispatch<SetStateAction<number>>
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, height, width, onChangeHeight, onChangeWidth, ...props}, ref) => {
    const [hover, setHover] = useState(false)
    return (
      <div
        ref={ref}
        style={{height: height, width: width}}
        className={cn('w-60 rounded-lg border bg-card text-card-foreground shadow-sm flex justify-center items-center relative', className)}
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <MixerHorizontalIcon className={cn(hover ? 'opacity-100' : 'opacity-0', 'transition-opacity duration-700 ease-out absolute top-2 right-2')} />
        <CardHandle hover={hover} axis='y' height={height} width={width} onChangeHeight={(h) => onChangeHeight(h)} onChangeWidth={(w) => onChangeWidth(w)} />
        <CardHandle hover={hover} axis='x' height={height} width={width} onChangeHeight={(h) => onChangeHeight(h)} onChangeWidth={(w) => onChangeWidth(w)} />
        <CardHandle hover={hover} axis='xy' height={height} width={width} onChangeHeight={(h) => onChangeHeight(h)} onChangeWidth={(w) => onChangeWidth(w)} />
      </div>
    )
  }
)

Card.displayName = 'Card'