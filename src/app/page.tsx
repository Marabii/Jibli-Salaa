// app/page.tsx (assuming you're using the App Router)
"use client";

import { Traveler } from "@/interfaces/Traveler/Traveler";
import type { CompletedOrder } from "@/interfaces/Order/order";
import { motion } from "framer-motion";
import DashboardCard from "@/components/HomePage/DashboardCard";
import AboutSection from "@/components/HomePage/AboutSection";
import CallToActionSection from "@/components/HomePage/CallToActionSection";
import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorksSection from "@/components/HomePage/HowItWorksSection";
import apiClient from "@/utils/apiClient";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [trips, setTrips] = useState<Traveler[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data concurrently for performance
      const [orders, trips]: [CompletedOrder[], Traveler[]] = await Promise.all(
        [
          apiClient("/api/protected/getOwnOrders", {}, false),
          apiClient("/api/protected/getOwnTrips", {}, false),
        ]
      );
      setOrders(orders);
      setTrips(trips);
    };

    fetchData();
  }, []);

  return (
    <div className="font-sans bg-gray-50 dark:bg-primary text-gray-900 dark:text-white">
      {/* User Dashboard Section */}
      {(orders?.length > 0 || trips?.length > 0) && (
        <section className="py-20 mt-32">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">
              Your Dashboard
            </h2>

            {/* Status Messages */}
            <div className="text-xl mb-8 text-center">
              {orders?.length > 0 && trips?.length > 0 && (
                <motion.h3
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  You have pending orders and scheduled trips.
                </motion.h3>
              )}
              {orders?.length > 0 && !trips?.length && (
                <motion.h3
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  You have pending orders.
                </motion.h3>
              )}
              {!orders?.length && trips?.length > 0 && (
                <motion.h3
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  You have scheduled trips.
                </motion.h3>
              )}
            </div>

            {/* Display Orders */}
            {orders?.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                  Your Orders ({orders.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((order, index) => (
                    <DashboardCard key={index} type="order" data={order} />
                  ))}
                </div>
              </div>
            )}

            {/* Display Trips */}
            {trips?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Your Trips ({trips.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip, index) => (
                    <DashboardCard key={index} type="trip" data={trip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Call to Action Section */}
      <CallToActionSection />
    </div>
  );
}
