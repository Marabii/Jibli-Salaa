"use client";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useRef, useEffect } from "react";
import { isValidMarker } from "./utilityFuncs";

interface LocationSearchProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  currentMarker: google.maps.places.PlaceResult | undefined;
}

export function LocationSearch({
  onPlaceSelect,
  currentMarker,
}: LocationSearchProps) {
  const [autocompleteInstance, setAutocompleteInstance] =
    useState<google.maps.places.Autocomplete>();
  const inputElement = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState<string>("");

  // Update inputValue when currentMarker changes
  useEffect(() => {
    if (isValidMarker(currentMarker) && currentMarker) {
      setInputValue(currentMarker.formatted_address || "");
    }
  }, [currentMarker]);

  // Initialize Autocomplete
  useEffect(() => {
    if (!placesLibrary || !inputElement.current) return;

    const options = {
      fields: ["geometry", "formatted_address", "address_components"],
      types: ["geocode"],
    };

    const autocomplete = new placesLibrary.Autocomplete(
      inputElement.current,
      options
    );

    setAutocompleteInstance(autocomplete);
  }, [placesLibrary]);

  // Listen for place selection from Autocomplete
  useEffect(() => {
    if (!autocompleteInstance) return;

    const listener = autocompleteInstance.addListener("place_changed", () => {
      const selectedPlace = autocompleteInstance.getPlace();
      onPlaceSelect(selectedPlace);
    });

    // Cleanup listener on unmount
    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [onPlaceSelect, autocompleteInstance]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="autocomplete-container p-2">
      <input
        type="text"
        ref={inputElement}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search a place"
        required
        className="px-3 py-2 bg-white shadow-md outline-none border border-gray-300 rounded w-64 sm:w-72"
      />
    </div>
  );
}
