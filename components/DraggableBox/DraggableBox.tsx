import { HTMLAttributes, forwardRef } from "react"
import styles from './Draggable.module.css'
import { cn } from "@/lib/utils"

export interface DraggableBoxProps extends HTMLAttributes<HTMLDivElement> {
}
export const DraggableBox = forwardRef<HTMLDivElement, DraggableBoxProps>(
  ({className, children, ...props}, ref) => {
    return (
      <div className={styles.draggableContainer}>
        <div className={cn(styles.draggableBox, 'w-full h-full')}>
          {children}
        </div>
      </div>
    )
  }
)

DraggableBox.displayName = 'DraggableBox'