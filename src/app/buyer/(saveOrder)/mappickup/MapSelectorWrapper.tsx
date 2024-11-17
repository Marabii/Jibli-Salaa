"use client";

import MapSelector from "@/components/Map/MapSelector";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import { useState } from "react";

export default function MapSelectorWrapper() {
  const [location, setLocation] = useState<AddressObject>();

  const handleLocationSelect = (loc: AddressObject) => {
    setLocation(loc);
  };

  return (
    <>
      <MapSelector onLocationSelect={handleLocationSelect} />
      {location && (
        <input
          type="hidden"
          required
          name="preferredPickupPlace"
          value={JSON.stringify(location)}
        />
      )}
    </>
  );
}
