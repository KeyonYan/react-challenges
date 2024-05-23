import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface AppLayoutProps extends HTMLAttributes<HTMLDivElement> {
  
}

export const AppLayout = forwardRef<HTMLDivElement, AppLayoutProps>(
  ({className, children, ...props}, ref) => {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    )
  }
)

export default AppLayout