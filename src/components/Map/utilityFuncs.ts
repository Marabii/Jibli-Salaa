import { AddressObject } from "@/interfaces/Map/AddressObject";

// Utility function to validate the marker object
export function isValidMarker(
  marker: google.maps.places.PlaceResult | undefined
) {
  if (!marker || !marker.geometry || !marker.geometry.location) {
    return false;
  }

  const { lat, lng } = marker.geometry.location;
  const isValidLat =
    typeof lat === "number" ||
    (typeof lat === "function" && typeof lat() === "number");
  const isValidLng =
    typeof lng === "number" ||
    (typeof lng === "function" && typeof lng() === "number");

  return isValidLat && isValidLng && !!marker.formatted_address;
}

export function updateTravelerLocation(
  place: google.maps.places.PlaceResult,
  setSelectedLocation: React.Dispatch<React.SetStateAction<AddressObject>>,
  setCurrentMarker: React.Dispatch<
    React.SetStateAction<google.maps.places.PlaceResult | undefined>
  >,
  onLocationSelect: (location: AddressObject) => void
) {
  if (!place.geometry || !place.geometry.location) return;

  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();
  const formatted_address = place.formatted_address ?? "";

  // --- Extract country name and code from address_components ---
  let countryName = "";
  let countryCode = "";
  if (place.address_components) {
    const countryComponent = place.address_components.find((comp) =>
      comp.types.includes("country")
    );
    if (countryComponent) {
      countryName = countryComponent.long_name || "";
      countryCode = countryComponent.short_name || "";
    }
  }
  // -------------------------------------------------------------

  const locationToSave: AddressObject = {
    formatted_address,
    lat,
    lng,
    countryName,
    countryCode,
  };

  // Update local state & notify parent
  setSelectedLocation(locationToSave);
  setCurrentMarker(place);
  onLocationSelect(locationToSave);
}
