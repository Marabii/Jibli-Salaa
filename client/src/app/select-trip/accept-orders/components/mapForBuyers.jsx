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

export default function MapForBuyers({ route, buyers }) {
  const [open, setOpen] = useState(false);

  const defaultCenter = {
    lat: route.departureCity.lat,
    lng: route.departureCity.lng,
  };

  return (
    <div>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GoogleMaps_API}>
        <div className="w-1/2 h-screen">
          <Map
            defaultZoom={10}
            defaultCenter={defaultCenter}
            mapId={process.env.NEXT_PUBLIC_GoogleMaps_MAPID}
            fullscreenControl={false}
          >
            <Directions route={route} />
            <ShowBuyers buyers={buyers} />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
}

function Directions({ route }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
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
    directionsService
      .route({
        origin: new google.maps.LatLng(
          route.departureCity.lat,
          route.departureCity.lng
        ),
        destination: new google.maps.LatLng(
          route.destinationCity.lat,
          route.destinationCity.lng
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

function ShowBuyers({ buyers }) {
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBuyerInfo = async () => {
      const userPromises = buyers.map((buyer) =>
        apiClient(`/api/getUser/${buyer.buyerId}`)
      );
      const productPromises = buyers.map((buyer) =>
        apiClient(`/api/getProduct/${buyer.productId}`)
      );

      const [userResponses, productResponses] = await Promise.all([
        Promise.all(userPromises),
        Promise.all(productPromises),
      ]);

      const userInfo = userResponses.map((response) => response.userInfo[0]);
      const productsInfo = productResponses.map((response) => response.product);

      setUsers(userInfo);
      setProducts(productsInfo);
    };

    fetchBuyerInfo();
  }, [buyers]);

  const handleMarkerClick = (buyer) => {
    setSelectedBuyer(buyer);
  };

  const selectedUser =
    selectedBuyer && users.find((u) => u._id === selectedBuyer.buyerId);
  const selectedProduct =
    selectedBuyer && products.find((p) => p._id === selectedBuyer.productId);

  return (
    <>
      {buyers.map((buyer) => (
        <AdvancedMarker
          key={buyer._id}
          position={{
            lat: buyer.prefferedPickupPlace.lat,
            lng: buyer.prefferedPickupPlace.lng,
          }}
          onClick={() => handleMarkerClick(buyer)}
        >
          <div className="bg-[#071933] p-2 text-white font-bold">
            <p>Proposed Fee: {buyer.initialDeliveryFee}</p>
            <p>
              Product Price:{" "}
              {products.find((p) => p._id === buyer.productId)?.value}
            </p>
          </div>
        </AdvancedMarker>
      ))}
      {selectedBuyer && selectedUser && selectedProduct && (
        <InfoWindow
          position={{
            lat: selectedBuyer.prefferedPickupPlace.lat,
            lng: selectedBuyer.prefferedPickupPlace.lng,
          }}
          onCloseClick={() => setSelectedBuyer(null)}
        >
          <div>
            <p>Name: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <img src={selectedUser.profilePicture} alt="profile picture" />
            <p>Product Price: {selectedProduct.value}</p>
            <p>Initial delivery fee: {selectedBuyer.initialDeliveryFee}</p>
            {selectedUser.isVerified && <p>Verified</p>}
            <p>
              Pickup Location:{" "}
              {selectedBuyer.prefferedPickupPlace.formatted_address}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
