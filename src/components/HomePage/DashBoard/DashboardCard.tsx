import "server-only";

import { FaBox, FaPlane } from "react-icons/fa";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { CompletedOrder } from "@/interfaces/Order/order";
import { Trip } from "@/interfaces/Traveler/Traveler";
import ConfirmDelivery from "./ConfirmDelivery";
import ImgsCarousel from "./ImgsCarousel";
import { getTranslations } from "next-intl/server";

type DashboardCardProps = {
  type: "order" | "trip";
  data: CompletedOrder | Trip;
};

export default async function DashboardCard({
  type,
  data,
}: DashboardCardProps) {
  const t = await getTranslations("HomePage.DashboardPage.DashboardCard");

  return (
    <div className="border border-black p-6 max-w-sm rounded-3xl flex-1 shadow-md transition-all duration-300 hover:shadow-xl">
      {type === "order" ? (
        <>
          <div className="flex items-center justify-center mb-4">
            <FaBox className="text-4xl text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">
            {(data as CompletedOrder).productName}
          </h3>
          <ImgsCarousel order={data as CompletedOrder} />
          {(data as CompletedOrder).orderStatus === ORDER_STATUS.PRICE_FROZEN &&
            (data as CompletedOrder)._id && (
              <ConfirmDelivery orderId={(data as CompletedOrder)._id!} />
            )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-center mb-4">
            <FaPlane className="text-4xl text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">
            {t("tripTo")} {(data as Trip).itinerary.to.formatted_address}
          </h3>
          <div className="text-black space-y-2">
            <p>
              <span className="font-semibold">{t("departure")}:</span>{" "}
              {new Date((data as Trip).itinerary.departure).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">{t("arrival")}:</span>{" "}
              {new Date((data as Trip).itinerary.arrival).toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
