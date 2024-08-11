"use client";

import { twMerge } from "tailwind-merge";
import { useState, useRef } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function Input({
  type,
  name,
  value,
  onChange,
  label,
  className,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useOutsideClick(inputRef, () => setIsFocused(false));

  return (
    <div ref={inputRef} className="relative my-5 w-fit">
      <label
        className={`${
          isFocused
            ? "absolute -top-[0.5rem] left-2 bg-white px-1 text-xs"
            : "absolute top-1/2 -translate-y-1/2 left-1 -z-10"
        } transition-all duration-300`}
        htmlFor="input"
      >
        {label}
      </label>
      <input
        onFocus={() => setIsFocused(true)}
        type={type || "text"}
        name={name}
        value={value}
        onChange={onChange}
        className={twMerge(
          `${className} border border-black p-2 rounded-md z-10 bg-transparent`
        )}
        {...props}
      />
    </div>
  );
}
