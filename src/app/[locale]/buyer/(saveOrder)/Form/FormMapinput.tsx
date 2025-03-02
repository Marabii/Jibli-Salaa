"use client";

import { useEffect, useState } from "react";
import useAdditionalData from "@/components/Form/useAdditionalData";
import MapSelector from "@/components/Map/MapSelector";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import { useTranslations } from "next-intl";

export default function FormMapInput() {
  const t = useTranslations("BuyerPage.SaveOrder.Form.FormMapInput");
  const { addAdditionalData, additionalData } = useAdditionalData();

  // Local state to hold the currently selected location
  const [selectedLocation, setSelectedLocation] = useState<AddressObject>({
    formatted_address: "",
    lat: null,
    lng: null,
    countryName: "",
    countryCode: "",
  });

  // On component mount or when additionalData changes, try to restore the saved location
  useEffect(() => {
    if (additionalData?.get("preferredPickupPlace")) {
      try {
        const savedLocation = JSON.parse(
          additionalData.get("preferredPickupPlace") as string
        );
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

    // Save immediately to your context / server:
    const formData = new FormData();
    formData.append("preferredPickupPlace", JSON.stringify(loc));
    addAdditionalData(formData);
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        {t("pickupPrompt")}
      </h2>
      <div className="w-full h-96 md:h-[500px] lg:h-[600px]">
        <MapSelector
          onLocationSelect={handleLocationSelect}
          className="w-full h-full"
          initialLocation={selectedLocation}
        />
      </div>
    </div>
  );
}
