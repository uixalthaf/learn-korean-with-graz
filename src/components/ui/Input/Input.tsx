import { Search } from "lucide-react";
import React from "react";
import { InputProps } from "./Input.types";

const Input = ({ placeholder }: InputProps) => {
  return (
    <div className="relative">
      <Search className="absolute top-3 left-2" size={16} />
      <input
        placeholder={placeholder || "Search..."}
        className="w-full min-w-0 rounded-lg border border-border bg-card p-2 pl-8 text-sm outline-none focus:border-primary"
      />
    </div>
  );
};

export default Input;
