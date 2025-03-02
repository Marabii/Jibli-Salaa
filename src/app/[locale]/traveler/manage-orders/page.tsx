import apiServer from "@/utils/apiServer";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { Link } from "@/i18n/navigation";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

function getOrderStatusDescription(
  status: ORDER_STATUS,
  t: (key: string) => string
): string {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return t("orderStatus.pending");
    case ORDER_STATUS.ORDER_ACCEPTED:
      return t("orderStatus.orderAccepted");
    case ORDER_STATUS.NEGOTIATION_PENDING:
      return t("orderStatus.negotiationPending");
    case ORDER_STATUS.ORDER_FINALIZED:
      return t("orderStatus.orderFinalized");
    case ORDER_STATUS.PRICE_FROZEN:
      return t("orderStatus.priceFrozen");
    case ORDER_STATUS.ITEM_BOUGHT:
      return t("orderStatus.itemBought");
    case ORDER_STATUS.EN_ROUTE:
      return t("orderStatus.enRoute");
    case ORDER_STATUS.DELIVERED:
      return t("orderStatus.delivered");
    case ORDER_STATUS.FUNDS_TRANSFERRED:
      return t("orderStatus.fundsTransferred");
    default:
      return t("orderStatus.unknown");
  }
}

export default async function ManageOrders() {
  const t = await getTranslations("TravelerTrip.ManageOrders");

  const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
    "/api/protected/getUserInfo"
  );
  const userInfo = userInfoResponse.data;
  if (userInfo.role !== ROLE.TRAVELER) {
    throw new Error(t("accessDenied"));
  }

  const response: ApiResponse<CompletedOrder[]> = await apiServer(
    `/api/protected/getOrdersByTravelerId/${userInfo._id}`
  );
  const orders = response.data;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
        <h3 className="text-2xl font-semibold mb-4 text-white">
          {t("noDeliveredOrders")}
        </h3>
        <p className="mb-6 text-gray-300 max-w-xl text-center">
          {t("noDeliveredOrdersDescription")}
        </p>
        <Link
          href="/traveler/select-trip"
          className="inline-block bg-white text-black py-3 px-6 rounded shadow-md hover:bg-gray-200 transition duration-300"
        >
          {t("selectTrip")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 text-white">
      <h2 className="text-center text-3xl font-bold mb-8 border-b border-gray-700 pb-4">
        {t("manageYourOrders")}
      </h2>
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {orders.map((order, index) => {
          const canNegotiate =
            order.orderStatus === ORDER_STATUS.ORDER_ACCEPTED ||
            order.orderStatus === ORDER_STATUS.NEGOTIATION_PENDING;

          return (
            <div
              key={index}
              className="bg-white text-black shadow-xl rounded-lg p-6 transform transition duration-300 hover:-translate-y-1 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <Image
                  className="w-20 h-20 object-cover rounded"
                  src={order.images[0]}
                  alt={t("productImageAlt")}
                  width={80}
                  height={80}
                />
                <div>
                  <p className="text-xl font-semibold">{order.productName}</p>
                  <p className="text-gray-600">
                    {order.actualDeliveryFee} {t("currency")}
                  </p>
                  <p className="text-sm font-medium text-blue-700">
                    {getOrderStatusDescription(order.orderStatus, t)}
                  </p>
                </div>
              </div>
              {canNegotiate && (
                <div className="mt-4 text-right">
                  <Link
                    href={`/negotiate?recipientId=${order.buyerId}&orderId=${order._id}`}
                    className="inline-block bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition duration-300"
                  >
                    {t("negotiate")}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
