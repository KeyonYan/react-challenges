import { useRef, useState, useEffect, forwardRef, HTMLAttributes } from "react"
import { useDebounce } from "@uidotdev/usehooks";
import styles from './ProgressBar.module.css'
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

export interface ProgressBoxProps extends VariantProps<typeof progressBoxVariants>{}
const progressBoxVariants = cva(
  "rounded-lg shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-[#f4f4f5]",
        bright: "bg-[#cdcdcd]",
        dark: "bg-[#27272a]"
      },
      size: {
        default: "h-6 w-60",
        sm: "h-4 w-60",
        lg: "h-8 w-60",
        xl: "h-10 w-60"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ProgressValueProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof progressValueVariants>{
  value: number,
  max: number
}
const progressValueVariants = cva(
  "h-full transition-width duration-500 ease-in-out text-lg flex justify-center items-center rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-[#18181b] text-white",
        bright: "bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4] text-white",
        dark: "bg-[#fafafa] text-[#27272a]"
      },
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface ProgressProps extends HTMLAttributes<HTMLElement>, ProgressBoxProps, ProgressValueProps {}
export const ProgressBar = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, size, value, max, ...props}, ref) => {
    return (
      <div className={cn(progressBoxVariants({ variant, size, className }))} ref={ref} {...props}>
        <ProgressValue className={cn(progressValueVariants({variant}))} value={value} max={max} />
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'

export const ProgressValue = forwardRef<HTMLDivElement, ProgressValueProps>(
  ({ className, variant, value, max, ...props}, ref) => {
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
      <div ref={innerProgressElement} {...props} style={{ width: `${value/max*100}%`}} className={`${styles.animateGradientBg} ${className}`}>
        <div className={`${hidden ? 'opacity-0' : 'opacity-100'} select-none leading-loose w-auto transition-opacity duration-1000 ease-in-out`} ref={valueElement}>{value}%</div>
      </div>
    )
  }
)

ProgressValue.displayName = 'ProgressValue'

export default ProgressBar;