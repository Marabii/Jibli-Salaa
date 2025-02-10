"use client";

import { useEffect, useState, useMemo } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import Link from "next/link";
import { PolyLine } from "./Polyline";
import { CompletedOrder } from "@/interfaces/Order/order";
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
 * Displays orders on the map.
 *
 * - Orders are grouped by location (using exact lat,lng).
 * - For groups with a single order, a normal marker is shown.
 * - For groups with multiple orders, a single cluster marker is displayed
 *   with the count of orders.
 * - Clicking a cluster marker opens an info window that lists all orders
 *   (sorted descending by initialDeliveryFee) with beautiful styling.
 */
function ShowBuyers({ orders }: { orders: CompletedOrder[] }) {
  const [activeGroup, setActiveGroup] = useState<{
    orders: CompletedOrder[];
    position: { lat: number; lng: number };
  } | null>(null);

  // Group orders by location key (using exact lat,lng values)
  const groupedOrders = useMemo(() => {
    const groups: Record<string, CompletedOrder[]> = {};
    orders.forEach((order) => {
      if (
        !order.preferredPickupPlace ||
        order.preferredPickupPlace.lat == null ||
        order.preferredPickupPlace.lng == null
      )
        return;
      const lat = order.preferredPickupPlace.lat;
      const lng = order.preferredPickupPlace.lng;
      const key = `${lat},${lng}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    });
    // Sort orders in each group by descending initialDeliveryFee
    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) => (b.initialDeliveryFee || 0) - (a.initialDeliveryFee || 0)
      );
    });
    return groups;
  }, [orders]);

  // Handler for marker click. For a single order, we simply show its details;
  // for multiple orders, we open a list.
  const handleMarkerClick = (
    ordersGroup: CompletedOrder[],
    position: { lat: number; lng: number }
  ) => {
    setActiveGroup({ orders: ordersGroup, position });
  };

  return (
    <>
      {Object.entries(groupedOrders).map(([locationKey, orderGroup]) => {
        if (orderGroup.length === 0) return null;
        const lat = Number(orderGroup[0].preferredPickupPlace.lat);
        const lng = Number(orderGroup[0].preferredPickupPlace.lng);
        const position = { lat, lng };

        return (
          <div key={locationKey}>
            <AdvancedMarker
              position={position}
              onClick={() => handleMarkerClick(orderGroup, position)}
            >
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-2 text-white font-bold text-lg rounded">
                {orderGroup.length} order{orderGroup.length > 1 ? "s" : ""} here
              </div>
            </AdvancedMarker>
          </div>
        );
      })}

      {/* InfoWindow for displaying list of orders in a group */}
      {activeGroup && (
        <InfoWindow
          position={
            new google.maps.LatLng(
              activeGroup.position.lat,
              activeGroup.position.lng
            )
          }
          onCloseClick={() => setActiveGroup(null)}
        >
          <OrderList activeGroup={activeGroup} />
        </InfoWindow>
      )}
    </>
  );
}

function OrderList({
  activeGroup,
}: {
  activeGroup: {
    orders: CompletedOrder[];
    position: {
      lat: number;
      lng: number;
    };
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-purple-600 to-pink-500 shadow-2xl rounded-2xl p-6 max-w-sm"
    >
      <h2 className="text-2xl font-extrabold text-white mb-4 border-b border-white pb-2">
        {activeGroup.orders.length} Order
        {activeGroup.orders.length > 1 && "s"}
      </h2>
      <ul className="max-h-60 overflow-y-auto space-y-3">
        {activeGroup.orders.map((order, index) => (
          <motion.li
            key={order._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="py-3 px-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <div className="flex whitespace-nowrap justify-between items-center gap-2 mb-1">
              <h2 className="font-semibold text-lg text-white">
                {order.productName}
              </h2>
              <h2 className="text-sm font-bold text-white">
                You&apos;ll get: {order.initialDeliveryFee} €
              </h2>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mt-3 flex items-center justify-between"
            >
              <span className="text-xs text-white font-bold whitespace-nowrap">
                Price: {order.estimatedValue} €
              </span>
              <Link
                href={`/negotiate?recipientId=${order.buyerId}&orderId=${order._id}`}
                className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
              >
                View Details
              </Link>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
