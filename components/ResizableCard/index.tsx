import { cn } from "@/lib/utils"
import { Dispatch, DragEventHandler, HTMLAttributes, MouseEventHandler, SetStateAction, forwardRef, useState } from "react"

type Axis = 'x' | 'y' | 'xy'

export interface HandleProps extends HTMLAttributes<HTMLDivElement> {
  axis: Axis
  hover: boolean
  size: CardSize
  min?: CardSize
  max?: CardSize
  onChangeSize: Dispatch<SetStateAction<CardSize>>
}

export const Handle = forwardRef<HTMLDivElement, HandleProps>(
  ({className, hover, axis, size, min, max, onChangeSize, ...props}, ref) => {
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const resizeBox: MouseEventHandler<HTMLDivElement> = (e) => {
      if (e.clientY <= 0 || e.clientX <= 0) return // avoid mouse to 0,0 when mouse up

      // compute diff
      let diffX = 0, diffY = 0
      if (axis === 'y') {
        diffY = e.clientY - mousePos.y
      } else if (axis === 'x') {
        diffX = e.clientX - mousePos.x
      } else if (axis === 'xy') {
        diffX = e.clientX - mousePos.x
        diffY = e.clientY - mousePos.y
      }

      // update size
      if (diffX !== 0 || diffY !== 0) {
        let newHeight = size.h + diffY;
        let newWidth = size.w + diffX;
        if (min && newHeight < min.h) newHeight = min.h
        if (min && newWidth < min.w) newWidth = min.w
        if (max && newHeight > max.h) newHeight = max.h
        if (max && newWidth > max.w) newWidth = max.w
        onChangeSize({h: newHeight, w: newWidth})
      }
      
      // update mouse spos
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
    }
    const handleResizeStart: DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      const dragImage = new Image()
      e.dataTransfer?.setDragImage(dragImage, 0, 0); // transparent drag image
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
    }
    const handleResize: DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      resizeBox(e)
    }
    const handleResizeEnd: DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      resizeBox(e)
    }
    const handleBoxStyle = `${axis.includes('y') ? 'bottom-0 w-1/2 h-1/6 cursor-row-resize flex-row' : ''} ${axis.includes('x') ? 'right-0 h-1/2 w-1/6 cursor-col-resize flex-col' : ''}`
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
        className={cn(hover ? 'opacity-100' : 'opacity-0', handleBoxStyle, 'absolute flex items-end justify-center transition-opacity duration-700 ease-out')}
      >
        <div className={cn(handleStyle, 'rounded-lg bg-[#6f6f6f]')}></div>
      </div>
    )
  }
)

Handle.displayName = 'Handle'

export type CardSize = {h: number, w: number}

export interface ResizableCardProps extends HTMLAttributes<HTMLDivElement> {
  size: CardSize
  min?: CardSize
  max?: CardSize
  fixable?: boolean
  onChangeSize: Dispatch<SetStateAction<CardSize>>
}

export const ResizableCard = forwardRef<HTMLDivElement, ResizableCardProps>(
  ({ className, children, fixable, size, min, max, onChangeSize, ...props}, ref) => {
    const [hover, setHover] = useState(false)
    return (
      <div
        ref={ref}
        style={{height: size.h, width: size.w}}
        className={cn(className, 'border rounded-lg shadow-sm flex justify-center items-center relative')}
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
        { !fixable &&
          <>
            <Handle hover={hover} size={size} min={min} max={max} onChangeSize={onChangeSize} axis='y' />
            <Handle hover={hover} size={size} min={min} max={max} onChangeSize={onChangeSize} axis='x' />
            <Handle hover={hover} size={size} min={min} max={max} onChangeSize={onChangeSize} axis='xy'/>
          </>
        }
      </div>
    )
  }
)

ResizableCard.displayName = 'ResizableCard'

