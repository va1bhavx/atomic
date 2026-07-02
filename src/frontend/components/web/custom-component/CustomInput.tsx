import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const inputVariants = cva(
  [
    "flex w-full min-w-0  border bg-white/[0.03] text-foreground ",
    "border-white/10 shadow-[var(--shadow-sm)]",
    "outline-none transition-[color,box-shadow,border-color,background-color] duration-150",
    "placeholder:text-muted-foreground",
    "selection:bg-primary/25 selection:text-foreground",
    "hover:border-white/[0.16]",
    "focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/20",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/10",
    "aria-invalid:border-destructive/60 aria-invalid:focus-visible:ring-destructive/20",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "file:mr-3",
  ],
  {
    variants: {
      inputSize: {
        sm: "h-8 px-2.5 text-[13px] ",
        default: "h-10 px-3.5 text-sm",
        lg: "h-11 px-4 text-[15px]",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  },
);

export interface InputProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Icon rendered inside the field, before the text */
  startIcon?: React.ReactNode;
  /** Icon rendered inside the field, after the text (e.g. a clear button) */
  endIcon?: React.ReactNode;
  /** Wrapper className, for layout on the outer container when icons are used */
  wrapperClassName?: string;
}

function Input({
  className,
  wrapperClassName,
  type = "text",
  inputSize,
  startIcon,
  endIcon,
  ...props
}: InputProps) {
  if (!startIcon && !endIcon) {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ inputSize }), className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center",
        props.disabled && "opacity-50",
        wrapperClassName,
      )}
    >
      {startIcon && (
        <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
          {startIcon}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputVariants({ inputSize }),
          startIcon && "pl-9",
          endIcon && "pr-9",
          className,
        )}
        {...props}
      />
      {endIcon && (
        <span className="absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4">
          {endIcon}
        </span>
      )}
    </div>
  );
}

export { Input, inputVariants };
