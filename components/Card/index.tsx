import { cn } from "@/lib/utils"
import { forwardRef, HTMLAttributes } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props}, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full h-full rounded-lg border shadow-sm flex justify-center items-center relative', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'