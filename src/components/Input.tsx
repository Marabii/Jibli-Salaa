import { useState, useRef, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";
import useOutsideClick from "@/hooks/useOutsideClick";

interface InputProps {
  type?: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
}

export default function Input({
  type = "text",
  name,
  value,
  onChange,
  label,
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(inputRef, () => setIsFocused(false));

  return (
    <div ref={inputRef} className="relative my-5 w-fit">
      <label
        htmlFor={name} // Updated to use `name` to ensure uniqueness and proper linking
        className={
          isFocused
            ? "absolute -top-[0.5rem] left-2 bg-white px-1 text-xs"
            : "absolute top-1/2 -translate-y-1/2 left-1 -z-10" +
              " transition-all duration-300"
        }
      >
        {label}
      </label>
      <input
        onFocus={() => setIsFocused(true)}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={twMerge(
          `${className ?? ""} border border-black p-2 rounded-md z-10 bg-transparent`
        )}
        {...props}
      />
    </div>
  );
}
