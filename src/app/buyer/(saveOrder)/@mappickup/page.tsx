"use client";
import { APIProvider, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBuyerOrder } from "@/store/BuyerOrderSlice/slice";
import {
  ControlPosition,
  MapControl,
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { AddressObject } from "@/interfaces/Map/AddressObject";

type PositionKey = "preferredPickupPlace";

export default function TravelerMap() {
  const pos: PositionKey = "preferredPickupPlace";
  const [isClientReady, setIsClientReady] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<AddressObject>({
    formatted_address: "",
    lat: null,
    lng: null,
  });
  const [currentMarker, setCurrentMarker] =
    useState<google.maps.places.PlaceResult>();
  const dispatch = useAppDispatch();
  const buyerOrderState = useAppSelector((state) => state.buyerOrder.value);

  // Ensure a marker is set on page load if the store has data
  useEffect(() => {
    const tripLocation: AddressObject = buyerOrderState[pos];
    if (
      tripLocation?.formatted_address &&
      tripLocation?.lat &&
      tripLocation?.lng
    ) {
      setCurrentMarker({
        formatted_address: tripLocation.formatted_address,
        geometry: {
          location: new google.maps.LatLng(tripLocation.lat, tripLocation.lng),
        },
      });
    }
  }, [buyerOrderState, pos]);

  // Check if the client is ready
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  if (!isClientReady) {
    return null;
  }

  // Update location in the Redux store
  const updateTravelerLocation = (
    place: google.maps.places.PlaceResult,
    pos: PositionKey
  ) => {
    if (!place?.geometry?.location) {
      console.error("Invalid place object:", place);
      return;
    }

    const { geometry } = place;
    const location = {
      formatted_address: place.formatted_address!,
      lat: geometry.location?.lat()!,
      lng: geometry.location?.lng()!,
    };
    setCurrentMarker(place);
    dispatch(setBuyerOrder({ [pos]: location }));
  };

  // Handle map click to set a marker and update location
  const handleMapClick = (event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const place = {
          formatted_address: results[0].formatted_address,
          geometry: {
            location: new google.maps.LatLng(latLng.lat, latLng.lng),
          },
        };

        updateTravelerLocation(place, pos);
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  // Remove marker on click
  const handleMarkerClick = () => setCurrentMarker(undefined);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API ?? ""}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GoogleMaps_MAPID}
        defaultZoom={2}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling="greedy"
        style={{
          height: "100vh",
          width: "100vw",
          maxWidth: "500px",
          maxHeight: "500px",
        }}
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
      <MapControl position={ControlPosition.TOP}>
        <LocationSearch
          onPlaceSelect={(place: google.maps.places.PlaceResult): void => {
            if (
              place.geometry &&
              place.geometry.location &&
              place.formatted_address
            ) {
              setSelectedLocation({
                formatted_address: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              });
              updateTravelerLocation(place, pos);
            } else {
              console.error("Invalid place object:", place);
              return;
            }
          }}
          currentMarker={currentMarker}
        />
      </MapControl>
      <MapManager selectedLocation={selectedLocation} />
    </APIProvider>
  );
}

// Component to manage map state and effects
const MapManager = ({
  selectedLocation,
}: {
  selectedLocation: AddressObject;
}) => {
  const mapInstance = useMap();

  useEffect(() => {
    if (!mapInstance || !selectedLocation) return;
    if (selectedLocation.lat === null || selectedLocation.lng === null) return;
    mapInstance.panTo(
      new google.maps.LatLng(selectedLocation.lat, selectedLocation.lng)
    );
    mapInstance.setZoom(15); // Zoom in on the selected location
  }, [mapInstance, selectedLocation]);

  return null;
};

// Autocomplete search component for location input
const LocationSearch = ({
  onPlaceSelect,
  currentMarker,
}: {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  currentMarker: google.maps.places.PlaceResult | undefined;
}) => {
  const [autocompleteInstance, setAutocompleteInstance] =
    useState<google.maps.places.Autocomplete>();
  const inputElement = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (isValidMarker(currentMarker) && currentMarker && inputElement.current) {
      inputElement.current.value = currentMarker.formatted_address || "";
    }
  }, [currentMarker]);

  // Initialize autocomplete on mount
  useEffect(() => {
    if (!placesLibrary || !inputElement.current) return;

    const options = {
      fields: ["geometry", "formatted_address"],
    };

    setAutocompleteInstance(
      new placesLibrary.Autocomplete(inputElement.current, options)
    );
  }, [placesLibrary]);

  // Handle place selection
  useEffect(() => {
    if (!autocompleteInstance) return;

    autocompleteInstance.addListener("place_changed", () => {
      const selectedPlace = autocompleteInstance.getPlace();
      onPlaceSelect(selectedPlace);
    });
  }, [onPlaceSelect, autocompleteInstance]);

  return (
    <div className="autocomplete-container">
      <input
        className="p-2 left-2 relative top-2"
        ref={inputElement}
        placeholder="Search a place"
      />
    </div>
  );
};

// Utility function to validate the marker object
function isValidMarker(marker: google.maps.places.PlaceResult | undefined) {
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
