"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import useAdditionalData from "@/components/Form/useAdditionalData";
import { useTranslations } from "next-intl";

export default function TripDates() {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const { addAdditionalData } = useAdditionalData();
  const t = useTranslations("TravelerTrip.saveTrip.TripDates");

  useEffect(() => {
    if (departureDate && arrivalDate) {
      const formData = new FormData();
      formData.append("departure", departureDate.toISOString());
      formData.append("arrival", arrivalDate.toISOString());
      addAdditionalData(formData);
    }
  }, [departureDate, arrivalDate, addAdditionalData]);

  return (
    <motion.div
      className="p-6 bg-white w-full rounded-lg mb-5 shadow-md max-w-screen-xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      dir="auto"
    >
      <motion.h2
        className="text-xl font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t("departureHeading")}
      </motion.h2>
      <DatePicker
        selected={departureDate}
        onChange={(date) => setDepartureDate(date)}
        minDate={new Date()}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText={t("departurePlaceholder")}
        className="w-full p-3 border rounded-md shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-black"
        wrapperClassName="w-full"
        customInput={
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        }
      />

      <motion.h2
        className="text-xl font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        {t("arrivalHeading")}
      </motion.h2>
      <DatePicker
        selected={arrivalDate}
        onChange={(date) => setArrivalDate(date)}
        minDate={departureDate || new Date()}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText={t("arrivalPlaceholder")}
        className="w-full p-3 border rounded-md shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-black"
        wrapperClassName="w-full"
        customInput={
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        }
      />
    </motion.div>
  );
}
