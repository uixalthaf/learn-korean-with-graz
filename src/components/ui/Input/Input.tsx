import { Search } from "lucide-react";
import React from "react";
import { InputProps } from "./Input.types";

const Input = ({ placeholder }: InputProps) => {
  return (
    <div className="relative">
      <Search className="absolute top-3 left-2" size={16} />
      <input
        placeholder={placeholder || "Search..."}
        className=" p-2 rounded-lg min-w-96 pl-8 border border-[#ccc]"
      />
    </div>
  );
};

export default Input;
