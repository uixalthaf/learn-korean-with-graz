import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DivProps = HTMLAttributes<HTMLDivElement>;

/** Container. Compose with CardHeader / CardBody / CardFooter. */
export const Card = ({ className, ...props }: DivProps) => (
  <div
    className={cn("rounded-2xl border border-border bg-card shadow-soft", className)}
    {...props}
  />
);

/** Top row of a card: put a CardTitle on the left and a link/button on the right. */
export const CardHeader = ({ className, ...props }: DivProps) => (
  <div className={cn("flex items-center justify-between gap-3 p-6 pb-3", className)} {...props} />
);

/** Card heading, e.g. "Today's sessions". */
export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold text-heading", className)} {...props} />
);

export const CardBody = ({ className, ...props }: DivProps) => (
  <div className={cn("p-6 pt-0 text-sm", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: DivProps) => (
  <div className={cn("border-t border-border p-6 pt-4", className)} {...props} />
);
