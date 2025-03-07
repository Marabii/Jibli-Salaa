"use client";

import { useEffect, useState } from "react";
import useAdditionalData from "@/components/Form/useAdditionalData";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import { useTranslations } from "next-intl";
import { CompletedOrder } from "@/interfaces/Order/order";
import dynamic from "next/dynamic";

const MapSelector = dynamic(() => import("@/components/Map/MapSelector"), {
  ssr: false,
});

export default function FormMapInput({
  orderInfoOrg,
}: {
  orderInfoOrg: CompletedOrder;
}) {
  const t = useTranslations(
    "BuyerPage.ManageOrders.EditOrder.OrderId.Form.FormMapInput"
  );
  const { addAdditionalData, additionalData } = useAdditionalData();

  // Initialize the selected location using orderInfoOrg only on the client.
  const [selectedLocation, setSelectedLocation] = useState<AddressObject>({
    formatted_address: "",
    lat: null,
    lng: null,
    countryName: "",
    countryCode: "",
  });

  // Try restoring a saved location from additionalData.
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
    } else if (orderInfoOrg?.preferredPickupPlace) {
      setSelectedLocation(orderInfoOrg.preferredPickupPlace);
      const formData = new FormData();
      formData.append(
        "preferredPickupPlace",
        JSON.stringify(orderInfoOrg.preferredPickupPlace)
      );
      addAdditionalData(formData);
    }
  }, [additionalData, orderInfoOrg?.preferredPickupPlace, addAdditionalData]);

  // When user selects a location, update the state and save the value.
  const handleLocationSelect = (loc: AddressObject) => {
    setSelectedLocation(loc);
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
