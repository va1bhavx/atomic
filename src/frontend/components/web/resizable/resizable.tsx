import React, { useState, useEffect, useRef } from "react";

export type ResizeDirection = "top" | "bottom" | "left" | "right";

export interface ResizableProps {
  children: React.ReactNode;
  directions: ResizeDirection[];
  defaultHeight?: number;
  defaultWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  onResize?: (size: { width: number; height: number }) => void;
  className?: string;
}

export function Resizable({
  children,
  directions,
  defaultHeight = 300,
  defaultWidth = 400,
  minHeight = 100,
  maxHeight = 800,
  minWidth = 100,
  maxWidth = 1200,
  onResize,
  className = "",
}: ResizableProps) {
  const [height, setHeight] = useState<number>(defaultHeight);
  const [width, setWidth] = useState<number>(defaultWidth);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep track of drag session variables
  const dragInfo = useRef<{
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const startResize = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragInfo.current = {
      direction,
      startX: clientX,
      startY: clientY,
      startWidth: width,
      startHeight: height,
    };

    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!dragInfo.current) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragInfo.current.startX;
      const deltaY = clientY - dragInfo.current.startY;

      let nextWidth = dragInfo.current.startWidth;
      let nextHeight = dragInfo.current.startHeight;

      switch (dragInfo.current.direction) {
        case "bottom":
          nextHeight = Math.max(
            minHeight,
            Math.min(maxHeight, dragInfo.current.startHeight + deltaY),
          );
          break;
        case "top":
          nextHeight = Math.max(
            minHeight,
            Math.min(maxHeight, dragInfo.current.startHeight - deltaY),
          );
          break;
        case "right":
          nextWidth = Math.max(
            minWidth,
            Math.min(maxWidth, dragInfo.current.startWidth + deltaX),
          );
          break;
        case "left":
          nextWidth = Math.max(
            minWidth,
            Math.min(maxWidth, dragInfo.current.startWidth - deltaX),
          );
          break;
      }

      setHeight(nextHeight);
      setWidth(nextWidth);

      if (onResize) {
        onResize({ width: nextWidth, height: nextHeight });
      }
    };

    const stopResize = () => {
      setIsDragging(false);
      dragInfo.current = null;
    };

    // Attach global listeners
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", stopResize);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", stopResize);
    };
  }, [
    isDragging,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
    onResize,
    width,
    height,
  ]);

  // Determine handles positioning CSS classes
  const handleStyles: Record<ResizeDirection, string> = {
    bottom:
      "absolute bottom-0 left-0 right-0 h-2 cursor-grab active:cursor-grabbing hover:bg-primary/20 border-b border-border-primary z-20 flex items-center justify-center",
    top: "absolute top-0 left-0 right-0 h-2 cursor-grab active:cursor-grabbing hover:bg-primary/20 border-t border-border-primary z-20 flex items-center justify-center",
    right:
      "absolute right-0 top-0 bottom-0 w-2 cursor-grab active:cursor-grabbing hover:bg-primary/20 border-r border-border-primary z-20 flex items-center justify-center",
    left: "absolute left-0 top-0 bottom-0 w-2 cursor-grab active:cursor-grabbing hover:bg-primary/20 border-l border-border-primary z-20 flex items-center justify-center",
  };

  const hasWidthProp =
    directions.includes("left") || directions.includes("right");
  const hasHeightProp =
    directions.includes("top") || directions.includes("bottom");

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{
        width: hasWidthProp ? `${width}px` : "100%",
        height: hasHeightProp ? `${height}px` : "auto",
      }}
    >
      {children}

      {/* Render selected directional resizer drag point handles */}
      {directions.map((dir) => (
        <div
          key={dir}
          onMouseDown={(e) => startResize(e, dir)}
          onTouchStart={(e) => startResize(e, dir)}
          className={handleStyles[dir]}
          title={`Drag to resize`}
        >
          {/* Subtle indicator bar */}
          {(dir === "bottom" || dir === "top") && (
            <div className="w-8 h-[2px] rounded bg-muted-foreground/30 hover:bg-primary" />
          )}
          {(dir === "left" || dir === "right") && (
            <div className="w-[2px] h-8 rounded bg-muted-foreground/30 hover:bg-primary" />
          )}
        </div>
      ))}
    </div>
  );
}
