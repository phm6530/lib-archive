import { cn } from "@/lib/utils";
import React from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Grid = ({ children, className, ...props }: GridProps) => {
  return (
    <div
      className={cn("max-w-[800px] mx-auto px-4 md:px-0", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid;
