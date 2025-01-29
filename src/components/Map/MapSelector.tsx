"use client";
import { APIProvider, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import {
  ControlPosition,
  MapControl,
  Map,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { isValidMarker, updateTravelerLocation } from "./utilityFuncs";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import { LocationSearch } from "./MapSearch";

interface MapSelectorProps {
  onLocationSelect: (selectedLocation: AddressObject) => void;
  className?: string;
  initialLocation?: AddressObject; // NEW: to restore user’s prior location
}

export default function MapSelector({
  onLocationSelect,
  className,
  initialLocation,
}: MapSelectorProps) {
  const [isClientReady, setIsClientReady] = useState<boolean>(false);
  const [currentMarker, setCurrentMarker] =
    useState<google.maps.places.PlaceResult>();
  const [selectedLocation, setSelectedLocation] = useState<AddressObject>(
    initialLocation || {
      formatted_address: "",
      lat: null,
      lng: null,
      countryName: "",
      countryCode: "",
    }
  );

  // If initialLocation changes (or on mount), set up the marker and location state
  useEffect(() => {
    if (
      initialLocation &&
      initialLocation.lat !== null &&
      initialLocation.lng !== null
    ) {
      setSelectedLocation(initialLocation);
      setCurrentMarker({
        formatted_address: initialLocation.formatted_address,
        geometry: {
          location: new google.maps.LatLng(
            initialLocation.lat,
            initialLocation.lng
          ),
        },
      });
    }
  }, [initialLocation]);

  // Check if the client is ready (avoid SSR issues)
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  if (!isClientReady) {
    return null;
  }

  // Handle map click to set a marker
  const handleMapClick = (event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        // Make sure to include address_components
        const place: google.maps.places.PlaceResult = {
          formatted_address: results[0].formatted_address,
          geometry: results[0].geometry,
          address_components: results[0].address_components,
        };

        // This now passes countryName and countryCode correctly
        updateTravelerLocation(
          place,
          setSelectedLocation,
          setCurrentMarker,
          onLocationSelect
        );
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  // Remove marker on marker click, if desired
  const handleMarkerClick = () => setCurrentMarker(undefined);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API ?? ""}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GoogleMaps_MAPID}
        defaultZoom={2}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling="greedy"
        className={className || "w-full h-full"}
        disableDefaultUI={true}
        onClick={handleMapClick}
      >
        {isValidMarker(currentMarker) &&
          currentMarker &&
          currentMarker.geometry?.location && (
            <AdvancedMarker
              key={currentMarker.formatted_address}
              position={currentMarker.geometry.location}
              onClick={handleMarkerClick}
            />
          )}
      </Map>

      {/** Add the autocomplete search on top */}
      <MapControl position={ControlPosition.TOP}>
        <LocationSearch
          onPlaceSelect={(place: google.maps.places.PlaceResult) => {
            if (
              place.geometry &&
              place.geometry.location &&
              place.formatted_address
            ) {
              updateTravelerLocation(
                place,
                setSelectedLocation,
                setCurrentMarker,
                onLocationSelect
              );
            } else {
              console.error("Invalid place object:", place);
            }
          }}
          currentMarker={currentMarker}
        />
      </MapControl>

      <MapManager selectedLocation={selectedLocation} />
    </APIProvider>
  );
}

/** Manages the map’s center & zoom based on selected location */
const MapManager = ({
  selectedLocation,
}: {
  selectedLocation: AddressObject;
}) => {
  const mapInstance = useMap();

  useEffect(() => {
    if (!mapInstance) return;
    if (selectedLocation.lat === null || selectedLocation.lng === null) return;

    // Pan and zoom to the new location
    mapInstance.panTo(
      new google.maps.LatLng(selectedLocation.lat, selectedLocation.lng)
    );
    mapInstance.setZoom(15);
  }, [mapInstance, selectedLocation]);

  return null;
};
