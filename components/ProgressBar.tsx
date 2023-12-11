import { useRef, useState, useEffect } from "react"
import { useDebounce } from "@uidotdev/usehooks";
import styles from './ProgressBar.module.css'

interface InnerProgressValueProps {
  value: number
  max: number
}

function InnerProgressValue( props: InnerProgressValueProps) {
  const { value, max } = props
  const [hidden, setHidden] = useState(true)
  const valueElement = useRef<HTMLDivElement>(null)
  const innerProgressElement = useRef<HTMLDivElement>(null)
  const debouncedUpdateValue = useDebounce(value, 300);
  useEffect(() => {
    if (debouncedUpdateValue) {
      const outerElementWidth = innerProgressElement.current?.offsetWidth ?? 0
      const textElementWidth = valueElement.current?.offsetWidth ?? 0
      if (!hidden && outerElementWidth <= textElementWidth + 10) {
        setHidden(true)
      } else if (hidden && outerElementWidth > textElementWidth + 10) {
        setHidden(false)
      }
    }
  }, [debouncedUpdateValue])

  return (
    <div ref={innerProgressElement} className={`${styles.animateGradientBg} transition-width duration-500 ease-in-out text-lg h-7 text-white flex justify-center rounded-lg bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4]`} style={{ width: `${value/max*100}%`}}>
      <div className={`${hidden ? 'opacity-0' : 'opacity-100 w-auto'} w-auto transition-opacity duration-1000 ease-in-out`} ref={valueElement}>{value}%</div>
    </div>
  )
}

export default function ProgressBar(props: InnerProgressValueProps) {
  let { value, max } = props
  return (
    <div className='rounded-lg border-2 bg-[#cdcdcd] shadow-lg h-8'>
      <InnerProgressValue value={value} max={max} />
    </div>
  )
}