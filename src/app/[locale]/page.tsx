import "server-only";

import AboutSection from "@/components/HomePage/AboutSection";
import CallToActionSection from "@/components/HomePage/CallToActionSection";
import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorksSection from "@/components/HomePage/HowItWorksSection";
import Dashboard from "@/components/HomePage/DashBoard/Dashboard";
import OrdersMap from "@/components/HomePage/OrdersMap/OrdersMap";

export default async function HomePage() {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Dashboard Section*/}
      <Dashboard />

      {/* Hero Section */}
      <HeroSection />

      {/* All orders around the world displayed on the map */}
      <OrdersMap />

      {/* About Section */}
      <AboutSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Call to Action Section */}
      <CallToActionSection />
    </div>
  );
}
