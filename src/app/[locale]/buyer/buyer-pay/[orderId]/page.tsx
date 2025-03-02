import apiServer from "@/utils/apiServer";
import PayButton from "./PayButton";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ROLE } from "@/interfaces/userInfo/userRole";
import { CompletedOrder } from "@/interfaces/Order/order";
import Tetromino from "../../../../../components/Loading/Tetromino/Tetromino";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import ImgsCarousel from "./ImgsCarousel";
import CollapsibleText from "./CollapsibleText";
import { format } from "currency-formatter";
import { ORDER_STATUS } from "../../../../../interfaces/Order/ORDER_STATUS";
import { getTranslations } from "next-intl/server";

export default async function BuyerPay({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const t = await getTranslations("BuyerPage.BuyerPay.OrderId.Page");
  const { orderId } = await params;
  const orderInfoResponse: ApiResponse<CompletedOrder> = await apiServer(
    `/api/getOrderById/${orderId}`
  );
  const orderInfo = orderInfoResponse.data;

  const buyerInfoResponse: ApiResponse<UserInfo> = await apiServer(
    "/api/protected/getUserInfo"
  );
  const buyerInfo = buyerInfoResponse.data;

  if (!buyerInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Tetromino />
      </div>
    );
  }

  if (buyerInfo?.role !== ROLE.BUYER) {
    throw new Error(t("notBuyerError"));
  }

  if (orderInfo?.orderStatus !== ORDER_STATUS.ORDER_FINALIZED) {
    throw new Error(t("orderNotFinalizedError"));
  }

  return (
    <div className="min-h-screen bg-gray-50 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl text-black font-extrabold text-center mb-12 animate-slideIn">
          {t("orderDetailsHeader")}
        </h1>
        <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {orderInfo.productName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="overflow-hidden rounded-xl">
              <ImgsCarousel order={orderInfo} />
            </div>
            <div dir="auto" className="flex flex-col justify-center">
              <div>
                <h3 className="text-xl font-semibold">
                  {t("productDescriptionLabel")}
                </h3>
                <CollapsibleText text={orderInfo.description} />
              </div>
              <div className="space-y-4 mt-3">
                <h3 className="text-xl font-semibold">
                  {t("quantityLabel")}:{" "}
                  <span className="text-lg">{orderInfo.quantity}</span>
                </h3>
                <h3 className="text-xl font-semibold">
                  {t("valueLabel")}:{" "}
                  <span className="text-lg">
                    {format(Number(orderInfo.actualValue), {
                      code: orderInfo.currency,
                    })}
                  </span>
                </h3>
                <h3 className="text-xl font-semibold">
                  {t("deliveryFeeLabel")}:{" "}
                  <span className="text-lg">
                    {format(Number(orderInfo.actualDeliveryFee), {
                      code: orderInfo.currency,
                    })}
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl p-8 mt-8">
          {orderInfo.deliveryInstructions && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">
                {t("deliveryInstructionsLabel")}
              </h3>
              <p className="text-gray-300">{orderInfo.deliveryInstructions}</p>
            </div>
          )}
          <div dir="auto" className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">
              {t("preferredPickupPlaceLabel")}
            </h3>
            <p className="text-gray-300">
              {orderInfo.preferredPickupPlace.formatted_address}
            </p>
          </div>
          <div className="flex justify-center">
            <PayButton orderInfo={orderInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
