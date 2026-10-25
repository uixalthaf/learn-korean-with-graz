import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  children?: ReactNode;
}
interface CardBodyProps {
  className?: string;
  children?: ReactNode;
}
interface CardHeaderProps {
  className?: string;
  children?: ReactNode;
}
interface CardFooterProps {
  className?: string;
  children?: ReactNode;
}
export const Card = ({ className, children }: CardProps) => {
  return <div className={cn("rounded-xl shadow-sm bg-[#fdfefb]", className)}>{children}</div>;
};

export const CardHeader = ({ className, children }: CardHeaderProps) => {
  return <div className={cn("font-bold text-md p-4", className)}>{children}</div>;
};
export const CardBody = ({ className, children }: CardBodyProps) => {
  return <div className={cn("text-sm p-4 pt-0 ", className)}>{children}</div>;
};

export const CardFooter = ({ className, children }: CardFooterProps) => {
  return <div className={cn("", className)}>{children}</div>;
};
