"use client";
import { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import apiClient from "@/utils/apiClient";

export default function MapForTrip({ data, buyers }) {
  const [isClient, setIsClient] = useState(false);
  const [directions, setDirections] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GoogleMaps_API,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isLoaded && data.departureCity && data.destinationCity) {
      const directionsService = new google.maps.DirectionsService();

      const origin = {
        lat: data.departureCity.lat,
        lng: data.departureCity.lng,
      };
      const destination = {
        lat: data.destinationCity.lat,
        lng: data.destinationCity.lng,
      };

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, data]);

  if (!isClient || !isLoaded) {
    return null;
  }

  const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
    maxWidth: "500px",
    maxHeight: "500px",
  };

  const defaultCenter = {
    lat: data.departureCity.lat,
    lng: data.departureCity.lng,
  };

  const handleMarkerClick = async (buyer) => {
    const user = await apiClient(`/api/getUser/${buyer.buyerId}`);
    const product = await apiClient(`/api/getProduct/${buyer.productId}`);

    setSelectedBuyer({
      user: user.userInfo[0],
      buyer,
      product: product.product,
    });
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={3}
      center={defaultCenter}
      options={{
        gestureHandling: "greedy",
        disableDefaultUI: true,
      }}
    >
      {/* Render the directions */}
      {directions && <DirectionsRenderer directions={directions} />}
      {/* Render the buyers markers */}
      {buyers.map((buyerData) => (
        <Marker
          icon={{
            url: `https://maps.google.com/mapfiles/kml/paddle/orange-circle.png`,
            scaledSize: new google.maps.Size(50, 50),
          }}
          position={{
            lat: buyerData.prefferedPickupPlace.lat,
            lng: buyerData.prefferedPickupPlace.lng,
          }}
          key={buyerData._id}
          onClick={() => handleMarkerClick(buyerData)}
          children={buyerData.prefferedPickupPlace.formatted_address}
        />
      ))}
      {/* Render the selected buyer info window */}
      {selectedBuyer && (
        <InfoWindow
          position={{
            lat: selectedBuyer.buyer.prefferedPickupPlace.lat,
            lng: selectedBuyer.buyer.prefferedPickupPlace.lng, // Use preferred pickup place coordinates
          }}
          onCloseClick={() => setSelectedBuyer(null)} // Close the InfoWindow
        >
          <div>
            <p>Name: {selectedBuyer.user.name}</p>
            <p>Email: {selectedBuyer.user.email}</p>
            <img
              src={selectedBuyer.user.profilePicture}
              alt="profile picture"
            />
            <p>Product Price: {selectedBuyer.product.value}</p>
            <p>
              Initial delivery fee: {selectedBuyer.buyer.initialDeliveryFee}
            </p>
            {selectedBuyer.user.isVerified && <p>Verified</p>}
            <p>
              Pickup Location:{" "}
              {selectedBuyer.buyer.prefferedPickupPlace.formatted_address}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
