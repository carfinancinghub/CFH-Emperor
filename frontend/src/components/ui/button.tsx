// @ai-generated (Wave-23 Inventory Stub)
// File: button.tsx
// Path: src/components/ui/button.tsx
// Purpose: Minimal shadcn-style Button to satisfy imports like "@/components/ui/button".

import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border border-gray-300 bg-white hover:bg-gray-50",
      ghost: "bg-transparent hover:bg-gray-100",
    };
    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3",
      md: "h-9 px-4",
      lg: "h-10 px-5",
    };

    return (
      <button
        ref={ref}
        className={cx(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
