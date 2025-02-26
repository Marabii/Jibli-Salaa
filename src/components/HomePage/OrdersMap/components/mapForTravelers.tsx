"use client";

import { useEffect, useState, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import Link from "next/link";
import { CompletedOrder } from "@/interfaces/Order/order";
import { motion } from "framer-motion";
import { ExchangeRate } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { format } from "currency-formatter";
import LoadingSpinner from "./LoadingSpinner";
import CurrencySelector from "./CurrencySelector";

export default function MapForTravelers({
  orders,
}: {
  orders: CompletedOrder[];
}) {
  const defaultCenter = { lat: 0, lng: 0 };
  const [currency, setCurrency] = useState("USD");

  return (
    <div className="px-1">
      {/* Currency Selector */}
      <div className="mb-6">
        <CurrencySelector setCurrency={setCurrency} />
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[500px] sm:h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API ?? ""}>
          <Map
            defaultZoom={3.5}
            defaultCenter={defaultCenter}
            mapId={process.env.NEXT_PUBLIC_GoogleMaps_MAPID}
            fullscreenControl={false}
            mapTypeControl={false}
            clickableIcons={false}
          >
            <ShowBuyers orders={orders} currency={currency} />
          </Map>
        </APIProvider>
      </div>
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
function ShowBuyers({
  orders,
  currency,
}: {
  orders: CompletedOrder[];
  currency: string;
}) {
  const [activeGroup, setActiveGroup] = useState<{
    orders: CompletedOrder[];
    position: { lat: number; lng: number };
  } | null>(null);

  // Group orders by lat,lng
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
    // Sort each group by descending initialDeliveryFee
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

  return (
    <>
      {/* Render a marker for each group */}
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
      {activeGroup && currency && (
        <InfoWindow
          position={
            new google.maps.LatLng(
              activeGroup.position.lat,
              activeGroup.position.lng
            )
          }
          onCloseClick={() => setActiveGroup(null)}
        >
          <OrderList activeGroup={activeGroup} travelerCurrency={currency} />
        </InfoWindow>
      )}
    </>
  );
}

/**
 * The list of orders displayed in the info window after clicking on a marker
 */
function OrderList({
  activeGroup,
  travelerCurrency,
}: {
  activeGroup: {
    orders: CompletedOrder[];
    position: { lat: number; lng: number };
  };
  travelerCurrency: string;
}) {
  const [exchangeRates, setExchangeRates] = useState<
    Record<string, ExchangeRate>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchExchangeRates() {
      try {
        const newRates: Record<string, ExchangeRate> = {};
        // fetch exchange rate for each order's currency => travelerCurrency
        for (const order of activeGroup.orders) {
          const exchangeRateResponse: ApiResponse<ExchangeRate> =
            await apiClient(
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
      className="bg-gradient-to-br from-purple-600 to-pink-500 shadow-2xl rounded-2xl p-6 
             max-w-full sm:max-w-md" // <— Removed max-w-sm or made it responsive
    >
      <h2 className="text-2xl font-extrabold text-white mb-4 border-b border-white pb-2">
        {activeGroup.orders.length} Order{activeGroup.orders.length > 1 && "s"}
      </h2>

      <ul
        // Adjust or remove forced height
        className="overflow-y-auto max-h-80 space-y-3"
      >
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
              <div
                className="flex flex-col md:flex-row whitespace-normal 
                       justify-between items-start md:items-center gap-2 mb-1"
              >
                <h2 className="font-semibold text-lg text-white">
                  {order.productName}
                </h2>
                <h2 className="text-sm font-bold text-white">
                  You&apos;ll get:{" "}
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
                  Price:{" "}
                  {format(
                    Number(
                      (order.estimatedValue * exchangeRate.rate).toFixed(2)
                    ),
                    { code: exchangeRate.target }
                  )}
                </h2>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
