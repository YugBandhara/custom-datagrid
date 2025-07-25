import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  checked?: boolean | "indeterminate";
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CustomCheckboxProps
>(({ className, checked, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked === "indeterminate" ? false : checked}
      data-state={
        checked === "indeterminate"
          ? "indeterminate"
          : checked
          ? "checked"
          : "unchecked"
      }
      {...props}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
          "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " +
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground " +
          "data-[state=indeterminate]:bg-primary/50 data-[state=indeterminate]:border-primary/70",
        className
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {checked === "indeterminate" ? (
          <Minus className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
