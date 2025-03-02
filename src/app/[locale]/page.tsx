import "server-only";

import AboutSection from "@/components/HomePage/AboutSection";
import CallToActionSection from "@/components/HomePage/CallToActionSection";
import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorksSection from "@/components/HomePage/HowItWorksSection";
import Dashboard from "@/components/HomePage/DashBoard/Dashboard";
import OrdersMap from "@/components/HomePage/OrdersMap/OrdersMap";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="font-sans bg-gray-50 dark:bg-primary text-gray-900 dark:text-white">
      {/* Dashboard Section*/}
      <Dashboard locale={locale} />

      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* All orders around the world displayed on the map */}
      <OrdersMap locale={locale} />

      {/* About Section */}
      <AboutSection locale={locale} />

      {/* How It Works Section */}
      <HowItWorksSection locale={locale} />

      {/* Call to Action Section */}
      <CallToActionSection locale={locale} />
    </div>
  );
}
