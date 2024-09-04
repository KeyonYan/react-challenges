import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import { OptionIcon } from "./icons/OptionIcon";

interface BaseNodeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export const BaseNode = forwardRef<HTMLButtonElement, BaseNodeProps>(({ children, ...props }, ref) => {
  return (
    <Button className="flex flex-col gap-2 text-node rounded-lg p-4 shadow-sm focus:outline-none focus:ring focus-ring-violet-300 hover:shadow-lg hover:bg-[#FBFBFC] bg-[#FBFBFC]" ref={ref} {...props}>
      <div className="flex items-center gap-2">
        <OptionIcon className="w-4 h-4" />
        <div>{props.title}</div>
      </div>
      {children}
    </Button>
  );
});

BaseNode.displayName = "BaseNode";

export default BaseNode;
