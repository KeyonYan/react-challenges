import { HTMLAttributes, forwardRef, useState } from "react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { MutableView, Rect } from "./MutableView"
import { Checkbox } from "../ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"

export interface MutableLayoutProps extends HTMLAttributes<HTMLDivElement> {
}
export const MutableLayout = forwardRef<HTMLDivElement, MutableLayoutProps>(
  ({className, children, ...props}, ref) => {
    const [rects, setRects] = useState<Rect[]>(
      [
        {x: 10, y: 10, w: 160, h: 160},
        {x: 10, y: 10, w: 160, h: 160}
      ]
    )
    const ctx = [
      {icon: '📽️', color: 'bg-blue-100'},
      {icon: '🖼️', color: 'bg-cyan-100'}
    ]
    const [isFixed, setIsFixed] = useState<CheckedState>(false)
    const handleResize = (w: number, h: number, idx?: number) => {
      console.log(`change size: w-${w}px h-${h}px`)
      const newRects = rects.map((rect, i) => {
        if (!idx || i === idx) return {x: rect.x, y: rect.y, w, h}
        else return rect
      })
      setRects(newRects)
    }
    const handleRectChange = (idx: number, newRect: Rect) => {
      const newRects = rects.map((rect, i) => {
        if (i === idx) {
          return newRect
        } else {
          return rect
        }
      })
      setRects(newRects)
    }
    return (
      <>
        <div className='flex flex-row gap-2'>
          <Button onClick={() => handleResize(80, 80)}>1x1</Button>
          <Button onClick={() => handleResize(80, 160)}>1x2</Button>
          <Button onClick={() => handleResize(160, 160)}>2x2</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isfixed" checked={isFixed} onCheckedChange={setIsFixed}/>
          <label
            htmlFor="isfixed"
            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            isFixed
          </label>
        </div>
        {rects.map((rect, i) => {
          return (
            <div key={i}>
              [{i}] --- x: {rect.x} y: {rect.y} width: {rect.w} height: {rect.h}
            </div>
          )
        })}
        <motion.div layout className='relative w-[500px] h-[500px] bg-red-100'>
          {rects.map((rect, i) => {
            return (
              <MutableView key={i} rect={rect} fixed={isFixed as boolean} onRectChange={(rect) => handleRectChange(i, rect)}>
                <div className={`${ctx[i].color} w-full h-full align-middle rounded-lg shadow-sm flex justify-center items-center text-6xl`}>
                  {ctx[i].icon}
                </div>
              </MutableView>
            )
          })}
        </motion.div>
      </>
    )
  }
)

MutableLayout.displayName = 'MutableLayout'