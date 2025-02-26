import "server-only";

import apiServer from "@/utils/apiServer";
import DashboardCard from "./DashboardCard";
import { CompletedOrder } from "@/interfaces/Order/order";
import { Trip } from "@/interfaces/Traveler/Traveler";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { getTranslations } from "next-intl/server";

export default async function DashboardHomePage() {
  const t = await getTranslations("HomePage");
  let orders: CompletedOrder[] = [];
  let trips: Trip[] = [];

  try {
    const [ordersResponse, tripsResponse]: [
      ApiResponse<CompletedOrder[]>,
      ApiResponse<Trip[]>
    ] = await Promise.all([
      apiServer("/api/protected/getOwnOrders", { cache: "no-cache" }),
      apiServer("/api/protected/getOwnTrips", { cache: "no-cache" }),
    ]);
    orders = ordersResponse.data;
    trips = tripsResponse.data;
  } catch (e) {}

  return (
    <>
      {/* User Dashboard Section */}
      {(orders?.length > 0 || trips?.length > 0) && (
        <section className="py-20 motion-translate-x-in-[-100%] motion-translate-y-in-[0%] motion-opacity-in-[0%] motion-duration-[1.00s]/opacity">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">
              Your Dashboard
            </h2>

            {/* Status Messages */}
            <div className="text-xl mb-8 text-center">
              {orders?.length > 0 && trips?.length > 0 && (
                <h3 className="mb-4">{t("Dashboard.statusMessages")}</h3>
              )}
              {orders?.length > 0 && !trips?.length && (
                <h3 className="mb-4">You have pending orders.</h3>
              )}
              {!orders?.length && trips?.length > 0 && (
                <h3 className="mb-4">You have scheduled trips.</h3>
              )}
            </div>

            {/* Display Orders */}
            {orders?.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                  Your Orders ({orders.length})
                </h2>
                <div className="flex flex-wrap gap-6">
                  {orders.map((order, index) => (
                    <DashboardCard key={index} type="order" data={order} />
                  ))}
                </div>
              </div>
            )}

            {/* Display Trips */}
            {trips?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Your Trips ({trips.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip, index) => (
                    <DashboardCard key={index} type="trip" data={trip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
