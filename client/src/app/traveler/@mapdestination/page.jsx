"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTravelerTrip } from "@/store/TravelerTripSlice/slice";

import {
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

export default function MapWithAutocomplete({ pos = "destination" }) {
  const [isClient, setIsClient] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const dispatch = useDispatch();
  const travelerTrip = useSelector((state) => state.travelerTrip.value);

  useEffect(() => {
    setIsClient(true);

    if (travelerTrip[pos]) {
      // Initialize the map and marker with the destination data
      setSelectedPlace(travelerTrip[pos]);
    }
  }, [travelerTrip, pos]);

  if (!isClient) {
    return null;
  }

  const setLocation = (place, pos) => {
    console.log(place);
    dispatch(setTravelerTrip({ [pos]: place }));
  };

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        mapId={"bf51a910020fa25a"}
        defaultZoom={3}
        defaultCenter={
          selectedPlace?.geometry?.location || { lat: 22.54992, lng: 0 }
        }
        gestureHandling={"greedy"}
        style={{
          height: "100vh",
          width: "100vw",
          maxWidth: "500px",
          maxHeight: "500px",
        }}
        disableDefaultUI={true}
      >
        <AdvancedMarker
          ref={markerRef}
          position={selectedPlace?.geometry?.location || null}
        />
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete
            onPlaceSelect={(place) => {
              setSelectedPlace(place);
              setLocation(place, pos);
            }}
            pos={pos}
          />
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
}

const MapHandler = ({ place, marker }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }

    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect, pos }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
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
      <input ref={inputRef} />
    </div>
  );
};
