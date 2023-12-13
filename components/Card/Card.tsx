import { cn } from "@/lib/utils"
import { DragEventHandler, HTMLAttributes, MouseEventHandler, forwardRef, useEffect, useRef, useState } from "react"

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props}, ref) => {
    const [hover, setHover] = useState<boolean>(false)
    const [cardHeight, setCardHeight] = useState<number>(200)
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [mouseToCardTop, setMouseToCardTop] = useState<number>(0)
    const cardElement = useRef<HTMLDivElement>(null)
    const handleResizeStart: MouseEventHandler<HTMLDivElement> = (e) => {
      setIsDragging(true)
      const newMouseToCardTop = e.clientY
      setMouseToCardTop(newMouseToCardTop)
    }
    const handleResizeEnd: MouseEventHandler<HTMLDivElement> = (e) => {
      setIsDragging(false)
      setMouseToCardTop(0)
    }
    const handleResizeY: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isDragging) return
      const diff = e.clientY - mouseToCardTop
      const newHeight = cardHeight + diff;
      setCardHeight(newHeight > 50 ? newHeight : 50); // Adjust minimum height
      setMouseToCardTop(e.clientY)
    }
    return (
      <div
        ref={cardElement}
        style={{height: cardHeight}}
        className={cn('w-60 rounded-lg border bg-card text-card-foreground shadow-sm flex justify-center relative', className)}
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div 
          onMouseMove={handleResizeY}
          onMouseDown={handleResizeStart}
          onMouseUp={handleResizeEnd}
          onMouseLeave={handleResizeEnd}
          className={cn(hover ? 'opacity-100' : 'opacity-0', 'cursor-row-resize absolute bottom-0 flex items-center justify-center w-full h-4')}
        >
          <div className='transition-opacity duration-2000 ease-in rounded-lg bg-[#6f6f6f] w-1/5 h-1'></div>
        </div>
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card