import React, { Children, DragEventHandler, HTMLAttributes, forwardRef, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface DraggableAreaProps extends HTMLAttributes<HTMLDivElement> {
}

export let maxZIndex = 1

export const DraggableArea = forwardRef<HTMLDivElement, DraggableAreaProps>(
  ({className, children, ...props}, ref) => {
    return (
      <div
        className={cn(className, 'relative')}
      >
        {Children.map(children, (child) => {
          if (!React.isValidElement(child)) return
          const childProps = {
            ...child.props,
          }
          return React.cloneElement(child, childProps)
        })}
      </div>
    )
  }
)

DraggableArea.displayName = 'DraggableArea'

export interface DraggableBoxProps extends HTMLAttributes<HTMLDivElement> {
  fixable?: boolean
}

export const DraggableBox = forwardRef<HTMLDivElement, DraggableBoxProps>(
  ({className, children, fixable, ...props}, ref) => {
    const [mousePos, setMousePos] = useState({x: 0, y: 0})
    const [posToArea, setPosToArea] = useState({x: 100, y: 100})
    const boxRef = useRef<HTMLDivElement>(null)
    const handleDragStart: DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      setMousePos({x: e.clientX, y: e.clientY})
      if (e.currentTarget) {
        e.currentTarget.style.zIndex = String(maxZIndex++)
      }
    }
    const handleDrag: DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      if (!e.currentTarget.parentElement) return
      if (e.clientX == 0 && e.clientY == 0) return
      e.dataTransfer.setDragImage(new Image(), 0, 0)
      e.dataTransfer.setData('', '')
      const boxRect = e.currentTarget.getBoundingClientRect()
      const areaRect = e.currentTarget.parentElement?.getBoundingClientRect()
      const newPosToArea = {
        x: e.currentTarget.offsetLeft + e.clientX - mousePos.x,
        y: e.currentTarget.offsetTop + e.clientY - mousePos.y
      }
      if (newPosToArea.x < 0) {
        newPosToArea.x = 0
      } else if (newPosToArea.x > areaRect.width - boxRect.width) {
        newPosToArea.x = areaRect.width - boxRect.width
      }
      if (newPosToArea.y < 0) {
        newPosToArea.y = 0
      } else if (newPosToArea.y > areaRect.height - boxRect.height) {
        newPosToArea.y = areaRect.height - boxRect.height
      }
      setPosToArea(newPosToArea)
      setMousePos({x: e.clientX, y: e.clientY})
    }
    const handleDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
    }
    return (
      <div
        ref={boxRef}
        draggable={!fixable}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          position: 'absolute',
          left: posToArea.x,
          top: posToArea.y,
          userSelect: 'none',
        }}
      >
        {children}
      </div>
    )
  }
)

DraggableBox.displayName = 'DraggableBox'