import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { BuyerOrderState } from "@/interfaces/Order/order";
import apiServer from "@/utils/apiServer";
import Link from "next/link";
import { Traveler } from "@/interfaces/Traveler/Traveler";

export default async function HomePage() {
  const cookieStore = cookies();

  const jwtTokenUndecoded: string | undefined =
    cookieStore.get("jwtToken")?.value;

  const userEmail: string | undefined =
    jwtTokenUndecoded && jwtDecode(jwtTokenUndecoded)?.sub;

  const orders: BuyerOrderState["value"][] = userEmail
    ? await apiServer("/api/protected/getOwnOrders")
    : [];

  const trips: Traveler[] = userEmail
    ? await apiServer("/api/protected/getOwnTrips")
    : [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome to Jibli</h2>

      {/* Corrected Logic for Status Message */}
      {orders?.length > 0 && trips?.length > 0 && (
        <h3 className="text-xl mb-4">
          You have pending orders as well as scheduled trips.
        </h3>
      )}
      {orders?.length > 0 && !trips?.length && (
        <h3 className="text-xl mb-4">You have pending orders.</h3>
      )}
      {!orders?.length && trips?.length > 0 && (
        <h3 className="text-xl mb-4">You have scheduled trips.</h3>
      )}

      {/* Display Orders */}
      {orders?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            You have made {orders.length} order{orders.length > 1 ? "s" : ""}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-medium mb-2">
                  {order.productName}
                </h3>
                <img
                  className="w-full h-48 object-cover mb-2"
                  src={order.images[0]}
                  alt="Order image"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display Trips */}
      {trips?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            You have {trips.length} scheduled trip{trips.length > 1 ? "s" : ""}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip: Traveler, index: number) => (
              <div
                key={index}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-medium mb-2">
                  Trip to {trip.itinerary.to.formatted_address}
                </h3>
                <p className="text-gray-600">
                  Departure:{" "}
                  {new Date(trip.itinerary.departure).toLocaleDateString(
                    "en-CA"
                  )}
                </p>
                <p className="text-gray-600">
                  Return:{" "}
                  {new Date(trip.itinerary.arrival).toLocaleDateString("en-CA")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
