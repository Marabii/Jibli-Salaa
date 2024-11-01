import apiServer from "@/utils/apiServer";
import { Suspense } from "react";
import MapForBuyers from "./components/mapForTravelers";
import type { BuyerOrderState } from "@/interfaces/Order/order";
import { AddressObject } from "@/interfaces/Map/AddressObject";
import { Itinerary } from "@/interfaces/Map/Itinerary";
import MapForTravelers from "./components/mapForTravelers";

interface SearchParams {
  countryStart: string;
  countryEnd: string;
  latStart: string;
  lngStart: string;
  latEnd: string;
  lngEnd: string;
}

export default async function AcceptOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { countryStart, latStart, lngStart, countryEnd, latEnd, lngEnd } =
    await searchParams;
  const result: BuyerOrderState["value"][] = await apiServer(
    `/api/protected/getOrders?countries_params=${countryStart} ${countryEnd}`
  );
  const route: {
    departureLocation: Omit<AddressObject, "formatted_address">;
    destinationLocation: Omit<AddressObject, "formatted_address">;
  } = {
    departureLocation: {
      lat: parseFloat(latStart), // Latitude
      lng: parseFloat(lngStart), // Longitude
    },
    destinationLocation: {
      lat: parseFloat(latEnd), // Latitude
      lng: parseFloat(lngEnd), // Longitude
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
      <MapForTravelers route={route} orders={result} />
    </Suspense>
  );
}
