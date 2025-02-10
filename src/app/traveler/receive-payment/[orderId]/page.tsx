"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import apiClient from "@/utils/apiClient";
import { Transfers } from "@/interfaces/Payment/Transfers";
import { AccountRequirementsResponse } from "@/interfaces/Payment/AccountRequirements";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";

interface ReceivePaymentParams {
  orderId: string;
}

/**
 * Component for initiating the funds transfer to the traveler.
 *
 * This component retrieves the order ID, creates a transfer quote,
 * fetches account requirements, and then collects the traveler's
 * banking information to send the funds. It displays appropriate
 * loading and error states with smooth animations.
 *
 * @param params - A promise resolving to an object containing the orderId.
 * @returns The rendered ReceivePayment component.
 */
export default function ReceivePayment({
  params,
}: {
  params: Promise<ReceivePaymentParams>;
}) {
  const [orderId, setOrderId] = useState<string>("");
  const [transfer, setTransfer] = useState<Transfers | null>(null);
  const [accountRequirements, setAccountRequirements] =
    useState<AccountRequirementsResponse | null>(null);
  const [areRequirementsUpToDate, setAreRequirementsUpToDate] =
    useState<boolean>(false);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(false);
  const [loadingRequirements, setLoadingRequirements] =
    useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch the order ID from the route parameters.
  useEffect(() => {
    async function fetchOrderId() {
      try {
        const { orderId } = await params;
        setOrderId(orderId);
      } catch (error) {
        setGlobalError("Failed to retrieve order details.");
      }
    }
    fetchOrderId();
  }, [params]);

  // Create a quote for the transfer once the order ID is available.
  useEffect(() => {
    async function createQuote() {
      if (!orderId) return;
      setLoadingQuote(true);
      setGlobalError(null);
      try {
        const result: ApiResponse<Transfers> = await apiClient(
          `/api/protected/transfer/createQuote/${orderId}`,
          { method: "POST" }
        );
        setTransfer(result.data);
      } catch (error) {
        setGlobalError("Failed to create quote. Please try again.");
      } finally {
        setLoadingQuote(false);
      }
    }
    createQuote();
  }, [orderId]);

  // Fetch account requirements when the transfer has been created.
  useEffect(() => {
    async function fetchAccountRequirements() {
      if (!orderId || !transfer) return;
      setLoadingRequirements(true);
      setGlobalError(null);
      try {
        const response: ApiResponse<AccountRequirementsResponse> =
          await apiClient(
            `/api/protected/transfer/getAccountRequirements1/${orderId}`
          );
        setAccountRequirements(response.data);
      } catch (error) {
        setGlobalError(
          "Failed to fetch account requirements. Please try again."
        );
      } finally {
        setLoadingRequirements(false);
      }
    }
    fetchAccountRequirements();
  }, [orderId, transfer]);

  /**
   * Handles form submission.
   *
   * If the account requirements are not up-to-date, the form data is used
   * to update them. Otherwise, the banking information is submitted to
   * initiate the funds transfer.
   *
   * @param data - The form data containing the traveler's banking details.
   */
  const onSubmit = async (data: Record<string, unknown>) => {
    setGlobalError(null);
    setSuccessMessage(null);
    setLoadingSubmit(true);
    try {
      if (!areRequirementsUpToDate) {
        const reqBody = { details: data };
        const result: ApiResponse<AccountRequirementsResponse> =
          await apiClient(
            `/api/protected/transfer/getAccountRequirements2/${orderId}`,
            {
              method: "POST",
              body: JSON.stringify(reqBody),
            }
          );
        setAccountRequirements(result.data);
        setAreRequirementsUpToDate(true);
      } else {
        if (!accountRequirements) {
          throw new Error("Account requirements not available.");
        }
        const { accountHolderName, ...details } = data;
        const createRecipientDTO = {
          type: accountRequirements[0].type,
          currency: "EUR",
          accountHolderName,
          details,
        };
        await apiClient(`/api/protected/transfer/sendTransfer/${orderId}`, {
          method: "POST",
          body: JSON.stringify({ createRecipientDTO }),
        });
        setSuccessMessage("Transfer initiated successfully.");
      }
    } catch (error: any) {
      console.error(error);
      setGlobalError(
        error?.message || "An unexpected error occurred during submission."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Framer Motion variants for container and loader.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const loaderVariants = {
    animate: {
      rotate: [0, 360],
      transition: { repeat: Infinity, duration: 1, ease: "linear" },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold mb-6">
        Enter Your Banking Information
      </h1>
      <p className="mb-6 text-lg">
        Thank you for your service. Please fill out the form below with your
        banking information.
      </p>

      {globalError && (
        <motion.div
          className="mb-4 p-3 bg-red-600 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {globalError}
        </motion.div>
      )}

      {(loadingQuote || loadingRequirements || loadingSubmit) && (
        <motion.div
          className="flex items-center justify-center mb-6"
          variants={loaderVariants}
          animate="animate"
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          className="mb-4 p-3 bg-green-600 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {successMessage}
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-gray-800 p-6 rounded shadow-lg"
      >
        {accountRequirements &&
          accountRequirements[0].fields.map((field) =>
            field.group.map((group) => {
              if (
                group.refreshRequirementsOnChange ||
                areRequirementsUpToDate
              ) {
                const validationRules = {
                  required: group.required ? "This field is required" : false,
                  minLength: group.minLength || undefined,
                  maxLength: group.maxLength || undefined,
                  pattern: group.validationRegexp
                    ? {
                        value: new RegExp(group.validationRegexp),
                        message: "Invalid format",
                      }
                    : undefined,
                };

                switch (group.type) {
                  case "select":
                    return (
                      <div key={group.key} className="mb-4">
                        <label
                          htmlFor={group.key}
                          className="block text-sm font-medium mb-1"
                        >
                          {group.name}
                        </label>
                        <select
                          id={group.key}
                          {...register(group.key, validationRules)}
                          className="border rounded p-2 w-full bg-black text-white"
                        >
                          {group.valuesAllowed?.map((value) => (
                            <option key={value.key} value={value.key}>
                              {value.name}
                            </option>
                          ))}
                        </select>
                        {errors[group.key] && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors[group.key]?.message?.toString()}
                          </p>
                        )}
                      </div>
                    );
                  case "text":
                    return (
                      <div key={group.key} className="mb-4">
                        <label
                          htmlFor={group.key}
                          className="block text-sm font-medium mb-1"
                        >
                          {group.name}
                        </label>
                        <input
                          id={group.key}
                          type="text"
                          {...register(group.key, validationRules)}
                          placeholder={
                            group.example ? `Example: ${group.example}` : ""
                          }
                          className="border rounded p-2 w-full bg-black text-white"
                        />
                        {errors[group.key] && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors[group.key]?.message?.toString()}
                          </p>
                        )}
                      </div>
                    );
                  case "date":
                    return (
                      <div key={group.key} className="mb-4">
                        <label
                          htmlFor={group.key}
                          className="block text-sm font-medium mb-1"
                        >
                          {group.name}
                        </label>
                        <input
                          id={group.key}
                          type="date"
                          {...register(group.key, validationRules)}
                          className="border rounded p-2 w-full bg-black text-white"
                        />
                        {errors[group.key] && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors[group.key]?.message?.toString()}
                          </p>
                        )}
                      </div>
                    );
                  case "radio":
                    return (
                      <div key={group.key} className="mb-4">
                        <p className="block text-sm font-medium mb-1">
                          {group.name}
                        </p>
                        {group.valuesAllowed?.map((value) => (
                          <label
                            key={value.key}
                            className="inline-flex items-center mr-4"
                          >
                            <input
                              type="radio"
                              value={value.key}
                              {...register(group.key, validationRules)}
                              className="form-radio text-white"
                            />
                            <span className="ml-2">{value.name}</span>
                          </label>
                        ))}
                        {errors[group.key] && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors[group.key]?.message?.toString()}
                          </p>
                        )}
                      </div>
                    );
                  default:
                    return null;
                }
              }
              return null;
            })
          )}
        <button
          type="submit"
          className="mt-4 w-full bg-white text-black rounded py-2 px-4 hover:bg-gray-200 transition-colors"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Processing..." : "Submit"}
        </button>
      </form>
    </motion.div>
  );
}
