"use client";

import { useEffect, useState } from "react";
import useAdditionalData from "@/components/Form/useAdditionalData";
import MapSelector from "@/components/Map/MapSelector";
import { AddressObject } from "@/interfaces/Map/AddressObject";

export default function FormMapInput() {
  const { addAdditionalData, additionalData } = useAdditionalData();

  // Local state to hold the currently selected location
  const [selectedLocation, setSelectedLocation] = useState<AddressObject>({
    formatted_address: "",
    lat: null,
    lng: null,
  });

  // On component mount or when additionalData changes, try to restore the saved location
  useEffect(() => {
    if (additionalData?.get("to")) {
      try {
        const savedLocation = JSON.parse(additionalData.get("to") as string);
        if (savedLocation && savedLocation.lat && savedLocation.lng) {
          setSelectedLocation(savedLocation);
        }
      } catch (error) {
        console.error("Failed to parse saved location:", error);
      }
    }
  }, [additionalData]);

  // When user selects a location on the map or via autocomplete
  const handleLocationSelect = (loc: AddressObject) => {
    setSelectedLocation(loc);

    // If you want to save immediately to your context / server:
    const formData = new FormData();
    formData.append("to", JSON.stringify(loc));
    addAdditionalData(formData);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Set your destination
      </h2>
      <div className="w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px]">
        <MapSelector
          onLocationSelect={handleLocationSelect}
          className="w-full h-full"
          initialLocation={selectedLocation}
        />
      </div>
    </div>
  );
}
