"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setBuyerOrder } from "@/store/BuyerOrderSlice/slice";

import {
  ControlPosition,
  MapControl,
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

export default function MapWithAutocomplete({ pos = "pickup" }) {
  const [isClient, setIsClient] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [marker, setMarker] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const setLocation = (place, pos) => {
    if (!place || !place.geometry || !place.geometry.location) {
      console.error("Invalid place object:", place);
      return;
    }

    const { formatted_address, geometry } = place;
    const location = {
      formatted_address,
      lat: geometry.location.lat,
      lng: geometry.location.lng,
    };

    setMarker(place);
    dispatch(setBuyerOrder({ [pos]: location }));
  };

  const handleMapClick = (event) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;

    const location = {
      lat: latLng.lat,
      lng: latLng.lng,
    };

    // Reverse Geocoding to get place name
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results[0]) {
        const place = {
          formatted_address: results[0].formatted_address,
          geometry: { location: latLng },
        };

        setMarker(place);
        setLocation(place, pos);
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const handleMarkerClick = () => setMarker(null);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        mapId={"bf51a910020fa25a"}
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={"greedy"}
        style={{
          height: "100vh",
          width: "100vw",
          maxWidth: "500px",
          maxHeight: "500px",
        }}
        disableDefaultUI={true}
        onClick={handleMapClick}
      >
        {marker && (
          <AdvancedMarker
            key={marker.formatted_address}
            position={marker.geometry.location}
            onClick={() => handleMarkerClick()}
          />
        )}
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete
            onPlaceSelect={(place) => {
              setSelectedPlace(place.geometry.location);
              setLocation(place, pos);
            }}
            pos={pos}
          />
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} />
    </APIProvider>
  );
}

const MapHandler = ({ place }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    console.log("place: ", place);

    map.panTo(place);
    map.setZoom(15); // Zoom in when a place is selected
  }, [map, place]);

  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      onPlaceSelect(place);
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} placeholder="Search a place" />
    </div>
  );
};
