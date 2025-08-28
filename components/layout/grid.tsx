import { cn } from "@/lib/utils";
import React from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Grid = ({ children, className, ...props }: GridProps) => {
  return (
    <div
      className={cn("max-w-[850px] mx-auto px-10 border-x ", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid;
