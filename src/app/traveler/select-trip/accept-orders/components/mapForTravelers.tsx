"use client";

import { useEffect, useState, useMemo } from "react";
import apiClient from "@/utils/apiClient";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import Link from "next/link";
import { PolyLine } from "./Polyline";
import { CompletedOrder } from "@/interfaces/Order/order";
import Image from "next/image";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

export type Route = {
  departureLocation: Omit<
    AddressObject,
    "formatted_address" | "countryName" | "countryCode"
  >;
  destinationLocation: Omit<
    AddressObject,
    "formatted_address" | "countryName" | "countryCode"
  >;
};

export default function MapForTravelers({
  route,
  orders,
}: {
  route: Route;
  orders: CompletedOrder[];
}) {
  const defaultCenter = {
    lat: route.departureLocation.lat || 0,
    lng: route.destinationLocation.lng || 0,
  };

  const [routeFound, setRouteFound] = useState<boolean>(true);
  const [showRouteData, setShowRouteData] = useState<boolean>(true); // New state for toggling

  // If the directions API fails, we fall back to a simple line between departure/destination
  const path = [
    {
      lat: route.departureLocation.lat || 0,
      lng: route.departureLocation.lng || 0,
    },
    {
      lat: route.destinationLocation.lat || 0,
      lng: route.destinationLocation.lng || 0,
    },
  ];

  // Toggle function
  const toggleRouteData = () => {
    setShowRouteData((prev) => !prev);
  };

  return (
    <div className="mb-5 relative">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API ?? ""}>
        <div className="h-screen mx-auto w-full relative">
          {/* Toggle Button */}
          <motion.button
            onClick={toggleRouteData}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 left-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label={showRouteData ? "Hide Route Data" : "Show Route Data"}
          >
            {showRouteData ? (
              <FiEyeOff className="w-6 h-6" />
            ) : (
              <FiEye className="w-6 h-6" />
            )}
          </motion.button>

          {defaultCenter.lat && defaultCenter.lng && (
            <Map
              defaultZoom={5}
              defaultCenter={defaultCenter}
              mapId={process.env.NEXT_PUBLIC_GoogleMaps_MAPID}
              fullscreenControl={false}
              mapTypeControl={false}
            >
              {routeFound ? (
                showRouteData && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-12 right-4 z-10"
                    >
                      <Directions
                        route={route}
                        onRouteFoundChange={setRouteFound}
                      />
                    </motion.div>
                  </AnimatePresence>
                )
              ) : (
                <PolyLine path={path} />
              )}
              <ShowBuyers orders={orders} />
            </Map>
          )}
        </div>
      </APIProvider>
    </div>
  );
}

function Directions({
  route,
  onRouteFoundChange,
}: {
  route: Route;
  onRouteFoundChange: (found: boolean) => void;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!map || !routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    if (
      !route ||
      !route.departureLocation.lat ||
      !route.destinationLocation.lat
    )
      return;

    directionsService
      .route({
        origin: new google.maps.LatLng(
          route.departureLocation.lat,
          route.departureLocation.lng
        ),
        destination: new google.maps.LatLng(
          route.destinationLocation.lat,
          route.destinationLocation.lng
        ),
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        onRouteFoundChange(true);
      })
      .catch((e) => {
        console.log("Directions request failed due to " + e);
        onRouteFoundChange(false);
      });
  }, [directionsRenderer, directionsService, onRouteFoundChange, route]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-w-xs">
      <h2 className="text-lg font-semibold mb-2">Route: {selected?.summary}</h2>
      <p className="text-sm">
        From {leg.start_address.split(",")[0]} to{" "}
        {leg.end_address.split(",")[0]}
      </p>
      <p className="text-sm">Distance: {leg.distance?.text}</p>
      <p className="text-sm">Duration: {leg.duration?.text}</p>
      <ul className="mt-3 space-y-2">
        {routes.map((r, index) => (
          <li key={r.summary} className="list-none">
            <button
              onClick={() => setRouteIndex(index)}
              className="text-blue-500 hover:text-blue-400 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Option {index + 1} : {r.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * ShowBuyers displays multiple orders on the map.
 * - Groups orders by identical lat/lng
 * - Sorts each group by highest fee first
 * - Slightly offsets them so they're not 100% stacked
 */
function ShowBuyers({ orders }: { orders: CompletedOrder[] }) {
  // State to keep track of the active marker's info
  const [activeMarker, setActiveMarker] = useState<{
    buyerInfo: UserInfo;
    orderId: string;
  } | null>(null);

  // Group orders by location (lat/lng). We round or use exact lat/lng
  // to create a grouping key.
  const groupedOrders = useMemo(() => {
    const mapByLocation: Record<string, CompletedOrder[]> = {};

    for (const order of orders) {
      if (
        !order.preferredPickupPlace ||
        order.preferredPickupPlace.lat == null ||
        order.preferredPickupPlace.lng == null
      ) {
        continue;
      }
      const lat = +order.preferredPickupPlace.lat;
      const lng = +order.preferredPickupPlace.lng;
      const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;

      if (!mapByLocation[key]) {
        mapByLocation[key] = [];
      }
      mapByLocation[key].push(order);
    }

    // Sort each group by highest proposed fee first
    Object.keys(mapByLocation).forEach((k) => {
      mapByLocation[k].sort(
        (a, b) => (b.initialDeliveryFee || 0) - (a.initialDeliveryFee || 0)
      );
    });

    return mapByLocation;
  }, [orders]);

  const handleMarkerClick = async (order: CompletedOrder) => {
    if (!order._id) return;
    try {
      const response: ApiResponse<UserInfo> = await apiClient(
        `/api/protected/getUserInfo/${order.buyerId}`
      );
      const userInfo = response.data;
      setActiveMarker({
        buyerInfo: userInfo,
        orderId: order._id,
      });
    } catch (error) {
      console.error("Error fetching buyer info:", error);
    }
  };

  return (
    <>
      {Object.entries(groupedOrders).map(([locationKey, orderGroup]) => {
        if (orderGroup.length === 0) return null;

        const lat = orderGroup[0].preferredPickupPlace.lat as number;
        const lng = orderGroup[0].preferredPickupPlace.lng as number;

        // For each order in this group, offset markers slightly
        // so they won't perfectly overlap.
        return orderGroup.map((order, index) => {
          const offset = 0.00005 * index; // Adjust for more/less spacing
          const markerLat = lat + offset;
          const markerLng = lng + offset;

          return (
            <div key={order._id}>
              <AdvancedMarker
                position={new google.maps.LatLng(markerLat, markerLng)}
                onClick={() => handleMarkerClick(order)}
              >
                <div className="bg-blue-900 p-2 text-white font-bold rounded">
                  <p>Fee: {order.initialDeliveryFee}</p>
                  <p>Price: {order.estimatedValue}</p>
                  {/* Add more marker info if needed */}
                </div>
              </AdvancedMarker>

              {/* Only show InfoWindow for the active marker */}
              {activeMarker && activeMarker.orderId === order._id && (
                <InfoWindow
                  position={new google.maps.LatLng(markerLat, markerLng)}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="bg-white shadow-lg rounded-lg p-4">
                    <div className="flex flex-col items-center space-y-2">
                      {activeMarker.buyerInfo.profilePicture && (
                        <Image
                          src={activeMarker.buyerInfo.profilePicture}
                          alt="profile picture"
                          width={100}
                          height={100}
                          className="rounded-full border-2 border-gray-300"
                        />
                      )}
                      <p className="text-lg font-semibold">
                        {activeMarker.buyerInfo.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activeMarker.buyerInfo.email}
                      </p>
                      <p className="text-md text-gray-800">
                        Product Price: {order.estimatedValue} €
                      </p>
                      <p className="text-md text-gray-800">
                        Proposed delivery fee: {order.initialDeliveryFee} €
                      </p>
                      <p className="text-md text-gray-800">
                        Pickup Location:{" "}
                        {order.preferredPickupPlace.formatted_address}
                      </p>
                      <Link
                        href={`/negotiate?recipientId=${order.buyerId}&orderId=${order._id}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </div>
          );
        });
      })}
    </>
  );
}
