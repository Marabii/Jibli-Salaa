"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTravelerTrip } from "@/store/TravelerTripSlice/slice";
import {
  ControlPosition,
  MapControl,
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

export default function TravelerMap({ pos = "start" }) {
  const [isClientReady, setIsClientReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const dispatch = useDispatch();
  const travelerTripState = useSelector((state) => state.travelerTrip.value);

  // Ensure a marker is set on page load if the store has data
  useEffect(() => {
    const tripLocation = travelerTripState?.[pos];
    if (
      tripLocation?.formatted_address &&
      tripLocation?.lat &&
      tripLocation?.lng
    ) {
      setCurrentMarker({
        formatted_address: tripLocation.formatted_address,
        geometry: {
          location: {
            lat: parseFloat(tripLocation.lat),
            lng: parseFloat(tripLocation.lng),
          },
        },
      });
    }
  }, [travelerTripState, pos]);

  // Check if the client is ready
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  if (!isClientReady) {
    return null;
  }

  // Update location in the Redux store
  const updateTravelerLocation = (place, pos) => {
    if (!place?.geometry?.location) {
      console.error("Invalid place object:", place);
      return;
    }

    const { formatted_address, geometry } = place;
    const location = {
      formatted_address,
      lat: geometry.location.lat,
      lng: geometry.location.lng,
    };

    setCurrentMarker(place);
    dispatch(setTravelerTrip({ [pos]: location }));
  };

  // Handle map click to set a marker and update location
  const handleMapClick = (event) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const place = {
          formatted_address: results[0].formatted_address,
          geometry: { location: latLng },
        };

        updateTravelerLocation(place, pos);
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  // Remove marker on click
  const handleMarkerClick = () => setCurrentMarker(null);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API}>
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
        {isValidMarker(currentMarker) && (
          <AdvancedMarker
            key={currentMarker.formatted_address}
            position={{
              lat: currentMarker.geometry.location.lat,
              lng: currentMarker.geometry.location.lng,
            }}
            onClick={handleMarkerClick}
          />
        )}
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <LocationSearch
          onPlaceSelect={(place) => {
            setSelectedLocation(place.geometry.location);
            updateTravelerLocation(place, pos);
          }}
          travelerTripState={travelerTripState}
          pos={pos}
          currentMarker={currentMarker}
        />
      </MapControl>
      <MapManager selectedLocation={selectedLocation} />
    </APIProvider>
  );
}

// Component to manage map state and effects
const MapManager = ({ selectedLocation }) => {
  const mapInstance = useMap();

  useEffect(() => {
    if (!mapInstance || !selectedLocation) return;

    mapInstance.panTo(selectedLocation);
    mapInstance.setZoom(15); // Zoom in on the selected location
  }, [mapInstance, selectedLocation]);

  return null;
};

// Autocomplete search component for location input
const LocationSearch = ({ onPlaceSelect, currentMarker }) => {
  const [autocompleteInstance, setAutocompleteInstance] = useState(null);
  const inputElement = useRef(null);
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (isValidMarker(currentMarker) && inputElement.current) {
      inputElement.current.value = currentMarker.formatted_address;
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
      <input ref={inputElement} placeholder="Search a place" />
    </div>
  );
};

// Utility function to validate the marker object
function isValidMarker(marker) {
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
