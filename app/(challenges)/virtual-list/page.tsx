'use client'

import FixedHeightList from "@/components/VirtualList/FixedHeightList";
import { CSSProperties, HTMLAttributes } from "react"

export interface RowProps extends HTMLAttributes<HTMLDivElement>{
  index: number
  style: CSSProperties 
}

const Row = (props: RowProps) => {
  const { index, style } = props
  return (
    <div style={style}>
      {`Row ${index}`}
    </div>
  )
}

export default function VirtualListPage() {
  return (
    <div className="flex flex-row gap-6">
      <FixedHeightList 
        height={200}
        width={200}
        itemSize={50}
        itemCount={100}
      >
        {Row}
      </FixedHeightList>
    </div>
  )
}
