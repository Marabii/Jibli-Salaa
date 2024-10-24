import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { ChevronDown } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  onSelect: (selectedValues: string | string[]) => void;
  selected: string | string[];
  multiple?: boolean;
}

export default function Dropdown({
  label,
  options,
  onSelect,
  multiple = false,
  selected = multiple ? [] : "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<string | string[]>(
    selected
  );

  useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: DropdownOption, event: MouseEvent) => {
    event.preventDefault();
    if (multiple) {
      const newSelectedOptions = Array.isArray(selectedItems)
        ? selectedItems.includes(option.value)
          ? selectedItems.filter((value) => value !== option.value)
          : [...selectedItems, option.value]
        : [option.value];
      setSelectedItems(newSelectedOptions);
      onSelect(newSelectedOptions);
    } else {
      setSelectedItems(option.value);
      onSelect(option.value);
      setIsOpen(false);
    }
  };

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const renderSelectedLabel = () => {
    if (multiple && Array.isArray(selectedItems) && selectedItems.length > 0) {
      return options
        .filter((option) => selectedItems.includes(option.value))
        .map((option) => option.label)
        .join(", ");
    }
    if (!multiple && selectedItems) {
      return options.find((option) => option.value === selectedItems)?.label;
    }
    return label;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {renderSelectedLabel()}
        <ChevronDown
          className="ml-2 h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute overflow-y-scroll max-h-[300px] z-10 mt-2 w-full rounded-md bg-white shadow-lg"
          role="listbox"
        >
          <ul className="py-1 text-sm text-gray-700">
            {options.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer hover:bg-gray-100 px-4 py-2 ${
                  multiple &&
                  Array.isArray(selectedItems) &&
                  selectedItems.includes(option.value)
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={(event) => handleOptionClick(option, event)}
                role="option"
                aria-selected={
                  Array.isArray(selectedItems)
                    ? selectedItems.includes(option.value)
                    : selectedItems === option.value
                }
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
