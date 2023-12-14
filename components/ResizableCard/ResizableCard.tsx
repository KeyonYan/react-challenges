import { cn } from "@/lib/utils"
import { Dispatch, DragEventHandler, HTMLAttributes, MouseEventHandler, SetStateAction, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

type Axis = 'x' | 'y' | 'xy'

export interface HandleProps extends HTMLAttributes<HTMLDivElement> {
  axis: Axis
  hover: boolean
  height?: number
  width?: number
  onChangeHeight?: (newHeight: number) => void
  onChangeWidth?: (newHeight: number) => void
}

const Handle = forwardRef<HTMLDivElement, HandleProps>(
  ({className, hover, axis, height, width, onChangeHeight, onChangeWidth, ...props}, ref) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const resizeBox: MouseEventHandler<HTMLDivElement> = (e) => {
      if (height && onChangeHeight && axis.includes('y')) {
        const diffY = e.clientY - mousePos.y
        const newHeight = height + diffY;
        onChangeHeight(newHeight)
        const newMousePos = {x: e.clientX, y: e.clientY}
        setMousePos(newMousePos)
      }
      if (width && onChangeWidth && axis.includes('x')) {
        const diffX = e.clientX - mousePos.x;
        const newWidth = width + diffX;
        onChangeWidth(newWidth)
        const newMousePos = {x: e.clientX, y: e.clientY}
        setMousePos(newMousePos)
      }
    }
    const handleResizeStart: DragEventHandler<HTMLDivElement> = (e) => {
      const dragImage = new Image()
      e.dataTransfer?.setDragImage(dragImage, 0, 0); // transparent drag image
      setIsDragging(true)
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
    }
    const handleResize: DragEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      resizeBox(e)
    }
    const handleResizeEnd: DragEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      setIsDragging(false)
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

Handle.displayName = 'Handle'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const ResizableCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props}, ref) => {
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const [hover, setHover] = useState(false)
    const boxRef = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
      if (boxRef.current) {
        setHeight(boxRef.current.offsetHeight)
        setWidth(boxRef.current.offsetWidth)
      }
    }, [])
    return (
      <div ref={boxRef} className={cn(className, 'rounded-lg')}>
        <div
          ref={ref}
          style={{height: height, width: width}}
          className='border rounded-lg bg-card text-card-foreground shadow-sm flex justify-center items-center relative'
          {...props}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {children}
          <MixerHorizontalIcon className={cn(hover ? 'opacity-100' : 'opacity-0', 'transition-opacity duration-700 ease-out absolute top-2 right-2')} />
          <Handle hover={hover} axis='y' height={height} onChangeHeight={setHeight} />
          <Handle hover={hover} axis='x' width={width} onChangeWidth={setWidth} />
          <Handle hover={hover} axis='xy' height={height} width={width} onChangeHeight={setHeight} onChangeWidth={setWidth} />
        </div>
      </div>
    )
  }
)

ResizableCard.displayName = 'ResizableCard'

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props}, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full h-full rounded-lg border bg-card text-card-foreground shadow-sm flex justify-center items-center relative', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'