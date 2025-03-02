"use client";
import { useEffect, useState } from "react";
import useAdditionalData from "@/components/Form/useAdditionalData";
import MapSelector from "@/components/Map/MapSelector";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import { useTranslations } from "next-intl";

export default function MapSelectorWrapperFrom() {
  const { addAdditionalData, additionalData } = useAdditionalData();
  const t = useTranslations("TravelerTrip.saveTrip.MapInputFrom");

  const [selectedLocation, setSelectedLocation] = useState<AddressObject>({
    formatted_address: "",
    lat: null,
    lng: null,
    countryName: "",
    countryCode: "",
  });

  useEffect(() => {
    if (additionalData?.get("from")) {
      try {
        const savedLocation = JSON.parse(additionalData.get("from") as string);
        if (savedLocation && savedLocation.lat && savedLocation.lng) {
          setSelectedLocation(savedLocation);
        }
      } catch (error) {
        console.error("Failed to parse saved location:", error);
      }
    }
  }, [additionalData]);

  const handleLocationSelect = (loc: AddressObject) => {
    setSelectedLocation(loc);
    const formData = new FormData();
    formData.append("from", JSON.stringify(loc));
    addAdditionalData(formData);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {t("heading")}
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
