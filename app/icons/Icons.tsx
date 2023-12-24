import { SVGProps } from "react";

export function ClarityDragHandleCornerLine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" {...props}><circle cx="12" cy="24" r="1.5" fill="currentColor" className="clr-i-outline clr-i-outline-path-1"></circle><circle cx="18" cy="24" r="1.5" fill="currentColor" className="clr-i-outline clr-i-outline-path-2"></circle><circle cx="18" cy="18" r="1.5" fill="currentColor" className="clr-i-outline clr-i-outline-path-3"></circle><circle cx="24" cy="12" r="1.5" fill="currentColor" className="clr-i-outline clr-i-outline-path-4"></circle><circle cx="24" cy="24" r="1.5" fill="currentColor" className="clr-i-outline clr-i-outline-path-5"></circle><circle cx="24" cy="18" r="1.5" fill="currentColor" className="clr-i-outline clr-i-outline-path-6"></circle><path fill="none" d="M0 0h36v36H0z"></path></svg>
  )
}