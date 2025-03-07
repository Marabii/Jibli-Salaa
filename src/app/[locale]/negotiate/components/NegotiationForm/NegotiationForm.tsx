"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import FormWrapper from "@/components/Form/FormWrapper";
import Input from "@/components/Input";
import FormSubmissionButton from "./Utilis/FormSubmissionButton";
import { negotiationFormAction } from "./Utilis/negotiationFormAction";
import FormErrorHandler from "@/components/Form/FormErrorHandler";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import apiClient from "@/utils/apiClient";
import { findCurrency } from "currency-formatter";
import LoadingSpinner from "@/components/Loading/LoadingSpinner/LoadingSpinner";

type NegotiationFormProps = {
  orderId: string;
  onSuccess: () => void;
};

export interface IFinalizeNegotiations {
  actualValue: number;
  actualDeliveryFee: number;
  orderId: string;
}

export default function NegotiationForm({
  orderId,
  onSuccess,
}: NegotiationFormProps) {
  const t = useTranslations("Negotiate.Components.NegotiationForm");
  const [currencyDetails, setCurrencyDetails] = useState<ReturnType<
    typeof findCurrency
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfoResponse: ApiResponse<UserInfo> = await apiClient(
          "/api/protected/getUserInfo"
        );
        const userInfo = userInfoResponse.data;
        const currency = findCurrency(userInfo.userBankCurrency);
        setCurrencyDetails(currency);
      } catch (error) {
        console.error("Error fetching user info", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  if (loading || !currencyDetails) {
    return <LoadingSpinner />;
  }

  return (
    <FormWrapper
      action={negotiationFormAction}
      onSuccess={onSuccess}
      className="flex sticky flex-col space-y-3 p-4 rounded"
    >
      <Input
        className="w-full outline-none border-b-2 border-white p-4"
        type="number"
        name="actualValue"
        label={t("actualValueLabel", { symbol: currencyDetails.symbol })}
        labelBgColor="transparent"
        labelTextColor="white"
        required
        pattern={String(/^\d+(\.\d+)?$/)}
        errorMessage=""
      />

      <Input
        className="w-full outline-none border-b-2 border-white p-4"
        type="number"
        name="actualDeliveryFee"
        label={t("actualDeliveryFeeLabel", { symbol: currencyDetails.symbol })}
        labelBgColor="transparent"
        labelTextColor="white"
        required
        pattern={String(/^\d+(\.\d+)?$/)}
        errorMessage=""
      />
      <input type="hidden" name="orderId" value={orderId} />
      <FormSubmissionButton />
      <FormErrorHandler />
    </FormWrapper>
  );
}
