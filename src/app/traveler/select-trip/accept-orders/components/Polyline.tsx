"use client";

import { useState, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface PolyLineProps {
  path: google.maps.LatLngLiteral[];
}

export function PolyLine({ path }: PolyLineProps) {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const [startMarker, setStartMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [endMarker, setEndMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!map) return;

    const initializeMarkers = async () => {
      // Load the marker library
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // Initialize the polyline if it hasn't been created yet
      if (!polyline) {
        const newPolyline = new google.maps.Polyline({
          path: path,
          map: map,
          geodesic: true, // Set to true for a curved line
          strokeColor: "#0acaff",
          strokeOpacity: 1.0,
          strokeWeight: 2,
          icons: [
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4,
                strokeColor: "#0acaff",
              },
              offset: "100%", // Arrow at the end
            },
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
                strokeColor: "#0acaff",
              },
              offset: "50%", // Arrow at the midpoint
            },
          ],
        });
        setPolyline(newPolyline);
      } else {
        // Update the polyline's path
        polyline.setPath(path);
      }

      // Add Start Marker
      if (path.length > 0 && !startMarker) {
        const newStartMarker = new AdvancedMarkerElement({
          position: path[0],
          map: map,
          title: "Start",
          content: document.createElement("div"), // Placeholder for custom content
        });
        setStartMarker(newStartMarker);
      }

      // Add End Marker
      if (path.length > 1 && !endMarker) {
        const newEndMarker = new AdvancedMarkerElement({
          position: path[path.length - 1],
          map: map,
          title: "End",
          content: document.createElement("div"), // Placeholder for custom content
        });
        setEndMarker(newEndMarker);
      }

      // Adjust the map to fit the polyline
      if (path.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        path.forEach((point) => {
          bounds.extend(point);
        });
        map.fitBounds(bounds);
      }
    };

    initializeMarkers();

    return () => {
      // Cleanup: remove polyline and markers from map on unmount
      if (polyline) {
        polyline.setMap(null);
      }
      if (startMarker) {
        startMarker.map = null;
      }
      if (endMarker) {
        endMarker.map = null;
      }
    };
  }, [map, polyline, startMarker, endMarker, path]);

  return null;
}
