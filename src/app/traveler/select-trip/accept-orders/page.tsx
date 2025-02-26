"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiSmile, FiRefreshCw } from "react-icons/fi";
import { getCountries } from "country-state-picker";
import type { StylesConfig, ActionMeta, MultiValue } from "react-select";
import type { GroupBase, Props as SelectProps } from "react-select";

import MapForTravelers, { Route } from "./components/mapForTravelers";
import { CompletedOrder } from "@/interfaces/Order/order";
import apiClient from "@/utils/apiClient";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";

// Dynamically import react-select
const Select = dynamic(() => import("react-select"), {
  ssr: false,
}) as React.ComponentType<
  SelectProps<CountryOption, true, GroupBase<CountryOption>>
>;

interface CountryOption {
  value: string;
  label: string;
}

interface ICountry {
  name: string;
  code: string;
  dial_code: string;
}

export default function TravelersPage() {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const latStart = searchParams.get("latStart");
  const lngStart = searchParams.get("lngStart");
  const latEnd = searchParams.get("latEnd");
  const lngEnd = searchParams.get("lngEnd");

  if (
    latStart === null ||
    lngStart === null ||
    latEnd === null ||
    lngEnd === null
  ) {
    throw new Error(
      "Latitude and Longitude must be provided in the query parameters."
    );
  }

  const route: Route = {
    departureLocation: { lat: parseFloat(latStart), lng: parseFloat(lngStart) },
    destinationLocation: { lat: parseFloat(latEnd), lng: parseFloat(lngEnd) },
  };

  // Map countries to options
  const countryOptions: CountryOption[] = getCountries().map(
    (country: ICountry) => ({
      value: country.code.toUpperCase(),
      label: country.name,
    })
  );

  const customStyles: StylesConfig<CountryOption, true> = {
    control: (base, state) => ({
      ...base,
      minHeight: "48px",
      borderRadius: "0.5rem",
      borderColor: "#4B5563",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6B7280",
      },
    }),
    option: (base, state) => ({
      ...base,
      color: "#374151",
      backgroundColor:
        state.isFocused || state.isSelected ? "#F3F4F6" : "white",
      ":active": {
        backgroundColor: "#E5E7EB",
        color: "#1F2937",
      },
    }),
    multiValue: (base, state) => ({
      ...base,
      backgroundColor: "#6B21A8",
      color: "white",
    }),
    multiValueLabel: (base, state) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base, state) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#4C1D95",
        color: "white",
      },
    }),
  };

  const handleCountrySelect = (
    selectedOptions: MultiValue<CountryOption>,
    actionMeta: ActionMeta<CountryOption>
  ) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setCountries([]);
      return;
    }

    const selectedCountries = selectedOptions.map((option) => option.value);
    setCountries(selectedCountries);
  };

  // Helper to get orders by country
  const fetchByCountries = async (countriesParam: string[]) => {
    try {
      const response: ApiResponse<CompletedOrder[]> = await apiClient(
        `/api/getOrders?countries_params=${countriesParam.join(" ")}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching orders by countries:", error);
      return [];
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalOrders: CompletedOrder[] = [];

      if (countries.length > 0) {
        finalOrders = await fetchByCountries(countries);
      } else {
        // If no countries selected, fetch all orders
        const response: ApiResponse<CompletedOrder[]> = await apiClient(
          `/api/getOrders`
        );
        finalOrders = response.data || [];
      }

      // Sort results by highest proposed fee first
      finalOrders.sort((a, b) => b.initialDeliveryFee - a.initialDeliveryFee);

      setOrders(finalOrders);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    setCountries([]);

    try {
      const response: ApiResponse<CompletedOrder[]> = await apiClient(
        `/api/getOrders`
      );
      const allOrders = response.data || [];
      allOrders.sort((a, b) => b.initialDeliveryFee - a.initialDeliveryFee);
      setOrders(allOrders);
    } catch (error) {
      console.error("Error in handleReset:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount (no filters)
  useEffect(() => {
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSearch(syntheticEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="min-h-screen p-1 sm:p-2 md:p-6 w-full max-w-screen-xl my-16 rounded-xl bg-white mx-auto shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-gray-800 mb-8 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Traveler View
      </motion.h1>

      {/* Filter Card */}
      <motion.form
        onSubmit={handleSearch}
        className="bg-white w-full grid grid-cols-1 md:grid-cols-2 gap-6 border border-black rounded-lg mb-8 p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Countries Select */}
        <div className="flex flex-col min-w-[200px]">
          <label
            htmlFor="Countries"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Countries
          </label>
          <Select
            id="Countries"
            options={countryOptions}
            isMulti
            className="basic-multi-select z-30"
            classNamePrefix="select"
            placeholder="Select Countries"
            onChange={handleCountrySelect}
            styles={customStyles}
            theme={(theme) => ({
              ...theme,
              borderRadius: 8,
              colors: {
                ...theme.colors,
                primary25: "#F3F4F6",
                primary: "#6B21A8",
              },
            })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:items-end sm:justify-end gap-4 min-w-[200px]">
          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-[113px] flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <FiSearch className="mr-2" />
            )}
            {isLoading ? "Searching..." : "Search"}
          </button>

          {/* Reset Button */}
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-[113px] flex items-center justify-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <FiRefreshCw className="mr-2" />
            Reset
          </motion.button>
        </div>
      </motion.form>

      {/* Orders Info Section */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md">
          <span className="text-xl font-bold">{orders.length}</span>
          <span className="text-md">Orders Found</span>
        </div>
        <AnimatePresence>
          {orders.length === 0 && !isLoading && (
            <motion.div
              className="flex items-center mt-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <FiSmile className="mr-2 text-2xl" />
              <span>
                We&apos;re sorry, but no orders were found matching your
                criteria.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Map Component */}
      <MapForTravelers route={route} orders={orders} />
    </motion.div>
  );
}
