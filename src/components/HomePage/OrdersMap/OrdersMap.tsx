import "server-only";
export const dynamic = "force-dynamic";

import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import MapForTravelers from "./components/mapForTravelers";
import { getTranslations } from "next-intl/server";

export default async function OrdersMap() {
  const t = await getTranslations("HomePage.OrdersMap");

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/api/getOrders`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  const response: ApiResponse<CompletedOrder[]> = await res.json();
  const orders = response.data;

  return (
    <section dir="auto" className="w-full py-16 bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
          {t("title")}
        </h2>
      </div>

      <div className="mt-10">
        {/* Pass the fetched orders to the client component */}
        <MapForTravelers orders={orders} />
      </div>
    </section>
  );
}
