"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function Dropdown({
  label,
  options,
  onSelect,
  multiple = false,
  selected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (selected) {
      setSelectedItems(selected);
    }
  }, [selected]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (multiple) {
      const isSelected = selectedItems.includes(option.value);
      let newSelectedOptions;

      if (isSelected) {
        newSelectedOptions = selectedItems.filter(
          (value) => value !== option.value
        );
      } else {
        newSelectedOptions = [...selectedItems, option.value];
      }

      setSelectedItems(newSelectedOptions);
      onSelect(newSelectedOptions);
    } else {
      onSelect(option.value);
      setIsOpen(false);
    }
  };

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleDropdown}
      >
        {multiple
          ? selectedItems.length > 0
            ? selectedItems
                .map(
                  (value) =>
                    options.find((option) => option.value === value)?.label
                )
                .join(", ")
            : label
          : selectedItems &&
            options.find((option) => option.value === selectedItems)?.label
          ? options.find((option) => option.value === selectedItems)?.label
          : label}
        <ChevronDown
          className="ml-2 h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute overflow-y-scroll max-h-[300px] z-10 mt-2 w-full rounded-md bg-white shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            {options.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer hover:bg-gray-100 px-4 py-2 ${
                  multiple && selectedItems.includes(option.value)
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
