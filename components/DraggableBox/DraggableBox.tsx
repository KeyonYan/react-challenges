import React, { Children, DragEventHandler, HTMLAttributes, KeyboardEventHandler, MouseEventHandler, RefObject, forwardRef, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface DraggableAreaProps extends HTMLAttributes<HTMLDivElement> {
}

export let maxZIndex = 1

type Rect = {
  h: number,
  w: number,
  x: number,
  y: number
}

type Position = {
  x: number,
  y: number
}

export const DraggableArea = forwardRef<HTMLDivElement, DraggableAreaProps>(
  ({className, children, ...props}, ref) => {
    const childCount = Children.count(children)
    const selectedAreaRef = useRef<HTMLDivElement>(null)
    const childRefs = useRef<Array<HTMLDivElement>>([])
    const [childSelectStatus, setChildSelectStatus] = useState<boolean[]>([])
    const [isCtrlPressed, setIsCtrlPressed] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectedArea, setSelectedArea] = useState<Rect>({h: 10, w: 10, x: 0, y: 0})
    const handleSelectStart: MouseEventHandler<HTMLDivElement> = (e) => {
      // is ctrl key pressed
      if (!isCtrlPressed) return
      if (!selectedAreaRef.current) return
      const newMousePos = {x: e.clientX - e.currentTarget.offsetLeft, y: e.clientY - e.currentTarget.offsetTop}
      if (newMousePos.x < 0 || newMousePos.y < 0) return
      selectedAreaRef.current.style.zIndex = String(maxZIndex + 1)
      setIsSelecting(true)
      setSelectedArea({h: 0, w: 0, x: newMousePos.x, y: newMousePos.y})
    }
    const handleSelect: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isCtrlPressed) {
        setIsSelecting(false)
        return
      }
      
      // update selected area
      const newMousePos = {x: e.clientX - e.currentTarget.offsetLeft, y: e.clientY - e.currentTarget.offsetTop}
      const newHeight = newMousePos.y - selectedArea.y
      const newWidth = newMousePos.x - selectedArea.x
      setSelectedArea({
        h: newHeight, 
        w: newWidth,
        x: selectedArea.x,
        y: selectedArea.y  
      })
    }
    const handleSelectEnd: MouseEventHandler<HTMLDivElement> = (e) => {
      if (!isSelecting) return
      setIsSelecting(false)
      // TODO: get selected box
      const selectedCount = selectingBoxs()
      console.log(selectedCount)
    }
    const selectingBoxs = () => {
      let selectedCount = 0
      let newChildSelectStatus: boolean[] = new Array<boolean>(childCount)
      childRefs.current.forEach((childRef, index) => {
        if (selectedArea.y > childRef.offsetTop) return
        if (selectedArea.x > childRef.offsetLeft) return
        if (selectedArea.y + selectedArea.h < childRef.offsetTop + childRef.offsetHeight) return
        if (selectedArea.x + selectedArea.w < childRef.offsetLeft + childRef.offsetWidth) return
        selectedCount++
        newChildSelectStatus[index] = true
      })
      setChildSelectStatus(newChildSelectStatus)
      return selectedCount
    }
    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
      if (e.ctrlKey) {
        console.log("key down")
        setIsCtrlPressed(true)
      }
    }
    const handleKeyUp: KeyboardEventHandler<HTMLDivElement> = (e) => {
      if (!e.ctrlKey) {
        console.log("key up")
        setIsCtrlPressed(false)
      }
    }
    return (
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleSelectStart}
        onMouseMove={handleSelect}
        onMouseUp={handleSelectEnd}
        className={cn(className, 'relative')}
      >
        {Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return
          childSelectStatus.push(false)
          const childProps = {
            fixable: isCtrlPressed ? true : false,
            ref: (ref: HTMLDivElement) => {
              childRefs.current[index] = ref
            },
            pos: {x: 10, y: 10},
            index: index,
            isSelected: childSelectStatus[index],
            ...child.props,
          }
          return React.cloneElement(child, childProps)
        })}
        <div
          ref={selectedAreaRef} 
          style={{
            opacity: isSelecting ? 100 : 0,
            height: selectedArea.h, 
            width: selectedArea.w, 
            top: selectedArea.y, 
            left: selectedArea.x,
          }} 
          className='absolute border-dotted border-cyan-500 border-2'>
        </div>
      </div>
    )
  }
)

DraggableArea.displayName = 'DraggableArea'

export interface DraggableBoxProps extends HTMLAttributes<HTMLDivElement> {
  fixable?: boolean
  isSelected?: boolean
  pos?: Position
  index?: number
}

const rectDefaultValue = {
  x: 0,
  y: 0,
}
export const DraggableBox = forwardRef<HTMLDivElement, DraggableBoxProps>(
  ({className, children, fixable, isSelected, pos, index, ...props}, ref) => {
    if (!pos) pos = rectDefaultValue
    const [mousePos, setMousePos] = useState({x: 0, y: 0})
    const [posToArea, setPosToArea] = useState({x: pos.x, y: pos.y})
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
        ref={ref}
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
        <div className="absolute top-1 left-1 z-10">{index}: {isSelected ? 'T' : 'F'}</div>
        {Children.map(children, (child) => {
          if (!React.isValidElement(child)) return
          const childProps = {
            fixable: fixable,
            ...child.props,
          }
          return React.cloneElement(child, childProps)
        })}
      </div>
    )
  }
)

DraggableBox.displayName = 'DraggableBox'