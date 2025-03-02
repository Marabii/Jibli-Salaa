import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ExchangeRate, UserInfo } from "@/interfaces/userInfo/userInfo";
import apiServer from "@/utils/apiServer";
import { format } from "currency-formatter";
import { getTranslations } from "next-intl/server";

type OrderDetailsProps = {
  orderId: string;
};

export default async function OrderDetails({ orderId }: OrderDetailsProps) {
  const tOrder = await getTranslations("ContactPage");
  let orderDetails: CompletedOrder | null;
  let exchangeRate: ExchangeRate | null;

  try {
    const fetchOrderDetailsResponse: ApiResponse<CompletedOrder> =
      await apiServer(`/api/getOrderById/${orderId}`);
    orderDetails = fetchOrderDetailsResponse.data;

    const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
      "/api/protected/getUserInfo"
    );

    const exchangeRateResponse: ApiResponse<ExchangeRate> = await apiServer(
      `/api/exchange-rate?target=${userInfoResponse.data.userBankCurrency}&source=${orderDetails.currency}`
    );

    exchangeRate = exchangeRateResponse.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return (
      <div
        className="bg-gray-700 text-red-400 p-3 rounded mt-2 animate-fadeIn"
        dir="auto"
      >
        {tOrder("OrderDetails.unableToLoad")}
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div
        className="bg-gray-700 text-yellow-400 p-3 rounded mt-2 animate-fadeIn"
        dir="auto"
      >
        {tOrder("OrderDetails.noOrderDetails")}
      </div>
    );
  }

  const productValue =
    orderDetails.actualValue || orderDetails.estimatedValue || 0;
  const deliveryFee =
    orderDetails.actualDeliveryFee || orderDetails.initialDeliveryFee || 0;

  return (
    <div className="mt-4 animate-fadeIn" dir="auto">
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        <div>
          <span className="text-gray-400 font-medium">
            {tOrder("OrderDetails.product")}:
          </span>{" "}
          <span className="text-white">{orderDetails.productName}</span>
        </div>
        <div>
          <span className="text-gray-400 font-medium">
            {tOrder("OrderDetails.price")}:
          </span>{" "}
          <span className="text-white">
            {format(Number((productValue * exchangeRate.rate).toFixed(2)), {
              code: exchangeRate.target,
            })}
          </span>
        </div>
        <div>
          <span className="text-gray-400 font-medium">
            {tOrder("OrderDetails.quantity")}:
          </span>{" "}
          <span className="text-white">{orderDetails.quantity}</span>
        </div>
        <div>
          <span className="text-gray-400 font-medium">
            {tOrder("OrderDetails.deliveryFee")}:
          </span>{" "}
          <span className="text-white">
            {format(Number((deliveryFee * exchangeRate.rate).toFixed(2)), {
              code: exchangeRate.target,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
