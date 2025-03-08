"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";
import useOutsideClick from "@/hooks/useOutsideClick";

interface InputProps {
  type?: string;
  name: string;
  value?: string | number;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  label: string;
  className?: string;
  pattern: string;
  errorMessage: string;
  isTextarea?: boolean;
  textareaHeight?: string;
  initialValue?: string | number;
  required?: boolean;
  labelBgColor?: string;
  labelTextColor?: string;
  readOnly?: boolean; // added readOnly prop
  errorClassName?: string; // added errorClassName prop
}

export default function Input({
  type = "text",
  name,
  value,
  onChange,
  label,
  className,
  pattern,
  errorMessage,
  isTextarea = false,
  initialValue = "",
  textareaHeight = "100px",
  required = false,
  labelBgColor = "white",
  labelTextColor = "black",
  readOnly = false,
  errorClassName,
  ...props
}: InputProps) {
  // Get the current locale to adjust label positioning
  const locale = useLocale();
  const labelPosition = locale === "ar" ? "right-2" : "left-2";

  // Function to parse pattern and flags from a regex string
  const parseRegex = (patternStr: string): RegExp | null => {
    const regexParts = patternStr.match(/^\/(.+)\/([a-z]*)$/i);
    if (regexParts) {
      const [, patternBody, flags] = regexParts;
      try {
        return new RegExp(patternBody, flags);
      } catch (e) {
        console.error("Invalid regex pattern:", e);
        return null;
      }
    }
    return null;
  };

  const regex = pattern ? parseRegex(pattern) : null;
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<string | number>(
    value !== undefined ? value : initialValue
  );

  const inputRef = useRef<HTMLDivElement>(null);

  useOutsideClick(inputRef, () => setIsFocused(false));

  useEffect(() => {
    // Sync the prop value with the currentValue state.
    setCurrentValue(value !== undefined ? value : initialValue);
  }, [value, initialValue]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    if (!required && newValue.trim() === "") {
      setError(null);
    } else if (regex && !regex.test(newValue)) {
      setError(errorMessage || "Invalid input.");
    } else {
      setError(null);
    }

    setCurrentValue(newValue);
    onChange && onChange(event);
  };

  return (
    <>
      <div dir="auto" ref={inputRef} className="relative mt-5 mb-1 w-full">
        <label
          htmlFor={name}
          style={{ backgroundColor: labelBgColor, color: labelTextColor }}
          className={twMerge(
            `absolute ${labelPosition} px-1 text-xs -z-10 transition-all duration-300`,
            isFocused || (currentValue !== null && currentValue !== "")
              ? "-top-[0.5rem] z-20"
              : "top-1/2 -translate-y-1/2 text-md text-gray-500",
            error && "text-red-500"
          )}
        >
          {label}
        </label>
        {!isTextarea ? (
          <input
            onFocus={() => setIsFocused(true)}
            type={type}
            name={name}
            value={currentValue}
            onChange={handleChange}
            required={required}
            readOnly={readOnly}
            className={twMerge(
              "bg-transparent",
              className ||
                "border p-2 relative rounded-md z-10 bg-transparent w-full",
              error ? "border-red-500" : "border-black"
            )}
            {...props}
          />
        ) : (
          <textarea
            onFocus={() => setIsFocused(true)}
            name={name}
            value={currentValue}
            onChange={handleChange}
            style={{ height: textareaHeight }}
            required={required}
            readOnly={readOnly}
            className={twMerge(
              "bg-transparent",
              className ||
                "border p-2 relative rounded-md z-10 bg-transparent w-full resize-none",
              error ? "border-red-500" : "border-black"
            )}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className={twMerge("text-sm text-red-500", errorClassName)}>
          {error}
        </p>
      )}
    </>
  );
}
