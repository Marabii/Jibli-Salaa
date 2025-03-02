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
import { Link } from "@/i18n/navigation";
import { PolyLine } from "./Polyline";
import { CompletedOrder } from "@/interfaces/Order/order";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ExchangeRate, UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { format } from "currency-formatter";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("TravelerTrip.AcceptOrders");
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

  const mapStyle = [
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
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
            aria-label={
              showRouteData
                ? t("selectTrip.routeDataToggleHide")
                : t("selectTrip.routeDataToggleShow")
            }
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
              clickableIcons={false}
              styles={mapStyle}
              disableDefaultUI={false}
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
              {/* Show all buyer orders on the map */}
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
  const t = useTranslations("TravelerTrip.AcceptOrders.Directions");
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
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true,
        suppressInfoWindows: true,
      })
    );
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
      <h2 className="text-lg font-semibold mb-2">
        {t("routeLabel", { summary: selected?.summary })}
      </h2>
      <p className="text-sm">
        {t("from")} {leg.start_address.split(",")[0]} {t("to")}{" "}
        {leg.end_address.split(",")[0]}
      </p>
      <p className="text-sm">
        {t("distance")} {leg.distance?.text}
      </p>
      <p className="text-sm">
        {t("duration")} {leg.duration?.text}
      </p>
      <ul className="mt-3 space-y-2">
        {routes.map((r, index) => (
          <li key={r.summary} className="list-none">
            <button
              onClick={() => setRouteIndex(index)}
              className="text-blue-500 hover:text-blue-400 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
              {t("option", { num: index + 1, summary: r.summary })}
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
 * - For groups with multiple orders, a single marker shows a count.
 * - Clicking the marker opens an InfoWindow listing all orders in that location.
 */
function ShowBuyers({ orders }: { orders: CompletedOrder[] }) {
  const [activeGroup, setActiveGroup] = useState<{
    orders: CompletedOrder[];
    position: { lat: number; lng: number };
  } | null>(null);

  // Traveler's currency, fetched only once
  const [travelerCurrency, setTravelerCurrency] = useState<string | null>(null);
  const [loadingTraveler, setLoadingTraveler] = useState<boolean>(true);

  // Fetch traveler data one time
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const travelerDataResponse: ApiResponse<UserInfo> = await apiClient(
          "/api/protected/getUserInfo"
        );
        if (isMounted) {
          setTravelerCurrency(travelerDataResponse.data.userBankCurrency);
        }
      } catch (error) {
        console.error("Failed to fetch traveler info:", error);
      } finally {
        if (isMounted) setLoadingTraveler(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Marker click handler
  const handleMarkerClick = (
    ordersGroup: CompletedOrder[],
    position: { lat: number; lng: number }
  ) => {
    setActiveGroup({ orders: ordersGroup, position });
  };

  if (loadingTraveler) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Render markers for each group */}
      {Object.entries(groupedOrders).map(([locationKey, orderGroup]) => {
        if (orderGroup.length === 0) return null;
        const lat = Number(orderGroup[0].preferredPickupPlace.lat);
        const lng = Number(orderGroup[0].preferredPickupPlace.lng);
        const position = { lat, lng };

        return (
          <div key={locationKey}>
            <AdvancedMarker
              position={position}
              title={""}
              onClick={(event) => {
                if (event.domEvent) {
                  event.domEvent.stopPropagation();
                }
                handleMarkerClick(orderGroup, position);
              }}
            >
              <div className="bg-gradient-to-br z-50 from-purple-600 to-pink-500 p-2 text-white font-bold text-lg rounded">
                {orderGroup.length} order{orderGroup.length > 1 ? "s" : ""}
              </div>
            </AdvancedMarker>
          </div>
        );
      })}

      {/* InfoWindow for displaying list of orders in a group */}
      {activeGroup && travelerCurrency && (
        <InfoWindow
          position={
            new google.maps.LatLng(
              activeGroup.position.lat,
              activeGroup.position.lng
            )
          }
          onCloseClick={() => setActiveGroup(null)}
        >
          <OrderList
            activeGroup={activeGroup}
            travelerCurrency={travelerCurrency}
          />
        </InfoWindow>
      )}
    </>
  );
}

/**
 * The list of orders displayed in the info window after clicking on a marker
 */

type OrderListProps = {
  activeGroup: {
    orders: CompletedOrder[];
    position: { lat: number; lng: number };
  };
  travelerCurrency: string;
};

function OrderList({ activeGroup, travelerCurrency }: OrderListProps) {
  const t = useTranslations("TravelerTrip.AcceptOrders.OrderList");
  const [exchangeRates, setExchangeRates] = useState<
    Record<string, ExchangeRate>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchExchangeRates() {
      try {
        const newRates: Record<string, ExchangeRate> = {};
        // Fetch exchange rate for each order's currency => travelerCurrency
        for (const order of activeGroup.orders) {
          const exchangeRateResponse = await apiClient(
            `/api/exchange-rate?target=${travelerCurrency}&source=${order.currency}`
          );
          newRates[order._id!] = exchangeRateResponse.data;
        }
        if (isMounted) {
          setExchangeRates(newRates);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        if (isMounted) setLoading(false);
      }
    }

    fetchExchangeRates();
    return () => {
      isMounted = false;
    };
  }, [activeGroup.orders, travelerCurrency]);

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-purple-600 to-pink-500 shadow-2xl rounded-2xl p-6 max-w-full sm:max-w-md"
    >
      <h2 className="text-2xl font-extrabold text-white mb-4 border-b border-white pb-2">
        {t("ordersTitle", { count: activeGroup.orders.length })}
      </h2>

      <ul className="overflow-y-auto max-h-80 space-y-3">
        {activeGroup.orders.map((order, index) => {
          const exchangeRate = exchangeRates[order._id!];

          if (!exchangeRate) {
            return (
              <li key={order._id}>
                <LoadingSpinner />
              </li>
            );
          }

          return (
            <motion.li
              key={order._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="py-3 px-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <div className="flex flex-col md:flex-row whitespace-normal justify-between items-start md:items-center gap-2 mb-1">
                <h2 className="font-semibold text-lg text-white">
                  {order.productName}
                </h2>
                <h2 className="text-sm font-bold text-white">
                  {t("youllGet")}{" "}
                  {format(
                    Number(
                      (order.initialDeliveryFee * exchangeRate.rate).toFixed(2)
                    ),
                    { code: exchangeRate.target }
                  )}
                </h2>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-3 flex flex-col gap-2 md:flex-row items-start md:items-center justify-between"
              >
                <h2 className="text-sm text-white font-bold">
                  {t("price")}{" "}
                  {format(
                    Number(
                      (order.estimatedValue * exchangeRate.rate).toFixed(2)
                    ),
                    { code: exchangeRate.target }
                  )}
                </h2>
                <Link
                  href={`/negotiate?recipientId=${order.buyerId}&orderId=${order._id}`}
                  className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
                >
                  {t("viewDetails")}
                </Link>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
