import "server-only";
import Input from "@/components/Input";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import apiServer from "@/utils/apiServer";
import { findCurrency } from "currency-formatter";
import { getTranslations } from "next-intl/server";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";

export default async function FormUsualInputs({
  orderInfoOrg,
}: {
  orderInfoOrg: CompletedOrder;
}) {
  const orderInfoCopy: CompletedOrder = { ...orderInfoOrg };

  const t = await getTranslations(
    "BuyerPage.ManageOrders.EditOrder.OrderId.Form.FormUsualInputs"
  );
  const userInfoResponse: ApiResponse<UserInfo> = await apiServer(
    "/api/protected/getUserInfo"
  );
  const userInfo = userInfoResponse.data;
  const currencyDetails = findCurrency(userInfo.userBankCurrency);

  return (
    <div className="z-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {t("header")}
      </h2>

      {/* Product URL */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        value={orderInfoCopy.productURL || ""}
        name="productURL"
        label={t("productURL.label")}
        pattern={String(/^https?:\/\/[^\s/$.?#].[^\s]*$/)}
        errorMessage={t("productURL.error")}
      />

      {(orderInfoCopy.orderStatus === ORDER_STATUS.PENDING ||
        orderInfoCopy.orderStatus === ORDER_STATUS.ORDER_ACCEPTED) && (
        <>
          {/* Estimated Value */}
          <Input
            className="w-full border-2 border-black p-5"
            type="number"
            value={orderInfoCopy.estimatedValue || 10}
            name="estimatedValue"
            label={t("estimatedValue.label", {
              code: currencyDetails?.code,
              symbol: currencyDetails?.symbol,
            })}
            pattern={String(/^(1[1-9]|[2-9][0-9]|[1-9][0-9]{2,})$/)}
            errorMessage={t("estimatedValue.error")}
            initialValue={10}
            required
          />

          {/* Initial Delivery Fee */}
          <Input
            className="w-full border-2 border-black p-5"
            type="number"
            value={orderInfoCopy.initialDeliveryFee || 5}
            label={t("initialDeliveryFee.label", {
              code: currencyDetails?.code,
              symbol: currencyDetails?.symbol,
            })}
            name="initialDeliveryFee"
            pattern={String(/^[5-9]\d*$|^\d{2,}$/)}
            errorMessage={t("initialDeliveryFee.error")}
            initialValue={5}
            required
          />

          {/* Quantity */}
          <Input
            className="w-full border-2 border-black p-5"
            type="number"
            value={orderInfoCopy.quantity || 1}
            label={t("quantity.label")}
            name="quantity"
            pattern={String(/^([1-9]|[1-9][0-9]+)$/)}
            errorMessage={t("quantity.error")}
            initialValue={1}
            required
          />
        </>
      )}

      {/* Product Name */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        value={orderInfoCopy.productName || ""}
        name="productName"
        label={t("productName.label")}
        pattern={String(/^[a-zA-Z0-9 .,'-]{3,100}$/)}
        errorMessage={t("productName.error")}
        required
      />

      {/* Description */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        value={orderInfoCopy.description || ""}
        name="description"
        label={t("description.label")}
        pattern={String(/^[\s\S]{10,10000}$/)}
        errorMessage={t("description.error")}
        isTextarea={true}
        required
      />

      {/* Length in cm */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        value={orderInfoCopy.dimensions.lengthInCm || undefined}
        label={t("dimensions.length.label")}
        name="dimensions.lengthInCm"
        pattern={String(/^(?!0*\.?0+$)\d*\.?\d+$/)}
        errorMessage={t("dimensions.length.error")}
      />

      {/* Width in cm */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        value={orderInfoCopy.dimensions.widthInCm || undefined}
        label={t("dimensions.width.label")}
        name="dimensions.widthInCm"
        pattern={String(/^(?!0*\.?0+$)\d*\.?\d+$/)}
        errorMessage={t("dimensions.width.error")}
      />

      {/* Height in cm */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        value={orderInfoCopy.dimensions.heightInCm || undefined}
        label={t("dimensions.height.label")}
        name="dimensions.heightInCm"
        pattern={String(/^(?!0*\.?0+$)\d*\.?\d+$/)}
        errorMessage={t("dimensions.height.error")}
      />

      {/* Special Instructions */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        value={orderInfoCopy.deliveryInstructions || ""}
        label={t("deliveryInstructions.label")}
        name="deliveryInstructions"
        pattern={String(/^[\s\S]{0,10000}$/)}
        errorMessage={t("deliveryInstructions.error")}
        isTextarea={true}
      />

      {/*Hidden input for orderId*/}
      <input type="hidden" name="orderId" value={orderInfoCopy._id || ""} />
    </div>
  );
}
