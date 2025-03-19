import "server-only";
export const dynamic = "force-dynamic";

import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import { getTranslations } from "next-intl/server";
import CurrentTravelers from "./components/CurrentTravelers/World";
import CurrentOrders from "./components/CurrentOrders/CurrentOrders";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import apiServer from "@/utils/apiServer";

export default async function OrdersMap() {
  const t = await getTranslations("HomePage.OnlineTransactions");

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVERURL}/api/getOrders`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  const response: ApiResponse<CompletedOrder[]> = await res.json();
  const orders = response.data.slice(0, 5);

  return (
    <section dir="auto" className="w-full px-4 py-16 bg-black">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl text-pretty sm:text-5xl font-extrabold mb-8 text-center text-white">
          {t("title")}
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 xl:grid-cols-2">
        <CurrentOrders orders={orders} />
        <CurrentTravelers />
      </div>
    </section>
  );
}
