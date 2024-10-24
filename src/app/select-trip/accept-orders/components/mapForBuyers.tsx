"use client";
import { useEffect, useState } from "react";
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
import { BuyerOrderState } from "@/interfaces/Order/order";
import { UserInfo } from "@/interfaces/userInfo/userInfo";

type Route = {
  departureLocation: Omit<AddressObject, "formatted_address">;
  destinationLocation: Omit<AddressObject, "formatted_address">;
};

export default function MapForBuyers({
  route,
  orders,
}: {
  route: Route;
  orders: BuyerOrderState["value"][];
}) {
  const [open, setOpen] = useState(false);

  const defaultCenter = {
    lat: route.departureLocation.lat ?? 0,
    lng: route.destinationLocation.lng ?? 0,
  };

  return (
    <div>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API ?? ""}>
        <div className="w-1/2 h-screen">
          {defaultCenter.lat && defaultCenter.lng && (
            <Map
              defaultZoom={10}
              defaultCenter={defaultCenter}
              mapId={process.env.NEXT_PUBLIC_GoogleMaps_MAPID}
              fullscreenControl={false}
            >
              <Directions route={route} />
              <ShowBuyers orders={orders} />
            </Map>
          )}
        </div>
      </APIProvider>
    </div>
  );
}

function Directions({ route }: { route: Route }) {
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
      });
  }, [directionsRenderer, directionsService]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return;

  return (
    <div className="text-white w-1/3 absolute top-1 right-1 bg-slate-800 p-3 rounded-md">
      <h2>{selected?.summary}</h2>
      <p>
        From {leg.start_address.split(",")[0]} to{" "}
        {leg.end_address.split(",")[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>
      <ul>
        {routes.map((route, index) => {
          return (
            <li key={route.summary}>
              <button onClick={() => setRouteIndex(index)}>
                {route.summary}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ShowBuyers({ orders }: { orders: BuyerOrderState["value"][] }) {
  const [selectedOrder, setSelectedOrder] = useState<
    BuyerOrderState["value"] | null
  >(null);
  const [orderBuyerInfo, setOrderBuyerInfo] = useState<UserInfo | null>(null);
  const handleMarkerClick = async (order: BuyerOrderState["value"]) => {
    const result: UserInfo = await apiClient("/api/protected/getUserInfo");
    setOrderBuyerInfo(result);
  };

  return (
    <>
      {orders.map((order) => {
        if (
          !order.preferredPickupPlace.lat ||
          !order.preferredPickupPlace.lng
        ) {
          return null;
        }
        const lat = order.preferredPickupPlace.lat as number;
        const lng = order.preferredPickupPlace.lng as number;

        return (
          <>
            <AdvancedMarker
              key={`${lat}-${lng}`}
              position={new google.maps.LatLng(lat, lng)}
              onClick={() => handleMarkerClick(order)}
            >
              <div className="bg-[#071933] p-2 text-white font-bold">
                <p>Proposed Fee: {order.initialDeliveryFee}</p>
                <p>Product Price: {order.estimatedValue}</p>
              </div>
            </AdvancedMarker>
            {orderBuyerInfo && (
              <InfoWindow
                position={new google.maps.LatLng(lat, lng)}
                onCloseClick={() => setOrderBuyerInfo(null)}
              >
                <div>
                  <p>Name: {orderBuyerInfo.name}</p>
                  <p>Email: {orderBuyerInfo.email}</p>
                  <img
                    src={orderBuyerInfo.profilePicture}
                    alt="profile picture"
                  />
                  <p>Product Price: {order.estimatedValue}</p>
                  <p>Initial delivery fee: {order.initialDeliveryFee}</p>
                  <p>
                    Pickup Location:{" "}
                    {order.preferredPickupPlace.formatted_address}
                  </p>
                </div>
              </InfoWindow>
            )}
          </>
        );
      })}
    </>
  );
}
