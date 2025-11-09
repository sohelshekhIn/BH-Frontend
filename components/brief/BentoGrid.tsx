import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
}

/**
 * Bento Grid Layout for Brief Components
 * Responsive grid that adapts to different component types
 */
export function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
      {children}
    </div>
  );
}

/**
 * Grid item wrapper that allows custom spanning
 */
interface BentoItemProps {
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  className?: string;
}

export function BentoItem({ children, colSpan = 1, rowSpan = 1, className = "" }: BentoItemProps) {
  const colSpanClass = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
  }[colSpan];

  const rowSpanClass = {
    1: "md:row-span-1",
    2: "md:row-span-2",
  }[rowSpan];

  return (
    <div className={`${colSpanClass} ${rowSpanClass} ${className}`}>
      {children}
    </div>
  );
}

