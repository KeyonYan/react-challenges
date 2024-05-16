import { RowProps } from "@/app/(challenges)/virtual-list/page"
import { CSSProperties, HTMLAttributes, UIEventHandler, cloneElement, useState } from "react"

interface FixedHeightListProps {
  height: number
  width: number
  itemSize: number
  itemCount: number
  children: (props: RowProps) => React.ReactElement
}

export default function FixedHeightList(props: FixedHeightListProps) {
  const { height, width, itemSize, itemCount, children } = props
  const [scrollOffset, setScrollOffset] = useState(0)
  const Component = children
  const containerStyle = {
    position: 'relative',
    height,
    width,
    overflow: 'auto'
  } as CSSProperties
  const contentStyle = {
    height: itemSize * itemCount,
    width: 'auto'
  } as CSSProperties
  const OFFSET_NUM = 2
  const getCurrentChildren = () => {
    const startIndex = Math.floor(scrollOffset / itemSize)
    const finalStartIndex = Math.max(0, startIndex - OFFSET_NUM)
    const numVisible = Math.ceil(height / itemSize)
    const endIndex = Math.min(itemCount, startIndex + numVisible + OFFSET_NUM)
    const items = []
    for (let i = finalStartIndex; i < endIndex; i++) {
      const itemStyle = {
        position: 'absolute',
        height: itemSize,
        width: 'auto',
        top: itemSize * i,
      } as CSSProperties
      items.push(
        <Component key={i} index={i} style={itemStyle} />
      )
    }
    return items
  }
  const scrollHandler: UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop } = e.currentTarget
    setScrollOffset(scrollTop)
  }
  return (
    <div style={containerStyle} onScroll={scrollHandler}>
      <div style={contentStyle}>
        {getCurrentChildren()}
      </div>
    </div>
  )
}