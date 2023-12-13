import { cn } from "@/lib/utils"
import { HTMLAttributes, MouseEventHandler, forwardRef, useState } from "react"

export interface CardHandleProps extends HTMLAttributes<HTMLDivElement> {
  hover: boolean
  height: number,
  width: number
  axis: 'x' | 'y' | 'xy'
  onCardResize: (height: number, width: number) => void
}

const CardHandle = forwardRef<HTMLDivElement, CardHandleProps>(
  ({className, hover, height, width, onCardResize, axis, ...props}, ref) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const handleResizeStart: MouseEventHandler<HTMLDivElement> = (e) => {
      setIsDragging(true)
      const newMousePos = {x: e.clientX, y: e.clientY}
      setMousePos(newMousePos)
      console.log("start: ", mousePos)
    }
    const handleResizeEnd: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      setIsDragging(false)
      console.log("end: ", mousePos)
    }
    const handleResize: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      console.log("resize: ", mousePos)
      let diffX = 0, diffY = 0
      if (axis.includes('y')) {
        diffY = e.clientY - mousePos.y;
      } else if (axis.includes('x')) {
        diffX = e.clientX - mousePos.x;
      }
      console.log("diffY: ", diffY)
      const newHeight = height + diffY;
      const newWidth = width + diffX;
      console.log("newHeight: ", newHeight)
      console.log("newWidth: ", newWidth)
      onCardResize(newHeight, newWidth); // Adjust minimum height
      setMousePos({x: e.clientX, y: e.clientY})
    }
    const handleBoxStyle = `${axis.includes('y') ? 'bottom-0 w-full h-8 cursor-row-resize' : ''} ${axis.includes('x') ? 'right-0 h-full w-8 cursor-col-resize' : ''}`
    const handleStyle = `${axis.includes('y') ? 'w-1/5 h-1' : ''} ${axis.includes('x') ? 'h-1/5 w-1' : ''}`
    return (
      <div
        ref={ref}
        onMouseMove={handleResize}
        onMouseDown={handleResizeStart}
        onMouseUp={handleResizeEnd}
        onMouseLeave={handleResizeEnd}
        className={cn(hover ? 'opacity-100' : 'opacity-0', handleBoxStyle, 'absolute flex items-center justify-center')}
      >
        <div className={cn(handleStyle, 'transition-opacity duration-2000 ease-in rounded-lg bg-[#6f6f6f]')}></div>
      </div>
    )
  }
)

CardHandle.displayName = 'CardHandle'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  height: number,
  width: number,
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, height, width, ...props}, ref) => {
    const [cardHeight, setCardHeight] = useState<number>(height)
    const [cardWidth, setCardWidth] = useState<number>(width)
    const [hover, setHover] = useState<boolean>(false)
    const handleCardResize = (height: number, width: number) => {
      console.log("card - height: ", height)
      setCardHeight(height)
      setCardWidth(width)
    }
    return (
      <div
        ref={ref}
        style={{height: cardHeight, width: cardWidth}}
        className={cn('w-60 rounded-lg border bg-card text-card-foreground shadow-sm flex justify-center items-center relative', className)}
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <CardHandle hover={hover} height={cardHeight} width={cardWidth} axis='y' onCardResize={handleCardResize}/>
        <CardHandle hover={hover} height={cardHeight} width={cardWidth} axis='x' onCardResize={handleCardResize}/>
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card