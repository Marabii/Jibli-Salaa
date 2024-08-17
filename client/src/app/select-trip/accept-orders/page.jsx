import apiServer from "@/utils/apiServer";
import { Suspense } from "react";
import MapForBuyers from "./components/mapForBuyers";

export default async function AcceptOrdersPage({ searchParams }) {
  const { tripId, latStart, lngStart, latEnd, lngEnd } = searchParams;
  const result = await apiServer(`/api/getOrders?tripId=${tripId}`);
  const route = {
    departureCity: {
      lat: parseFloat(latStart), // Latitude for New York City
      lng: parseFloat(lngStart), // Longitude for New York City
    },
    destinationCity: {
      lat: parseFloat(latEnd), // Latitude for Los Angeles
      lng: parseFloat(lngEnd), // Longitude for Los Angeles
    },
  };

  return (
    <Suspense
      fallback={
        <div className="bg-black w-[500px] h-[500px] text-white text-3xl">
          Loading...
        </div>
      }
    >
      <MapForBuyers route={route} buyers={result} />
    </Suspense>
  );
}
