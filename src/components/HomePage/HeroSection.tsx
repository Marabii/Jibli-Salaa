import "server-only";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function HeroSection({ locale }: { locale: string }) {
  const t = await getTranslations("HomePage.HeroSection");

  return (
    <section className="bg-black text-white py-6 md:py-24 xl:py-32">
      <div className="container gap-5 mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
        {/* Text Content */}
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="md:w-1/2">
          <h1 className="text-5xl font-bold mb-4 text-balance motion-preset-slide-right motion-duration-1000">
            {t("heroHeading")}
          </h1>
          <p className="text-lg mb-8 text-balance motion-preset-slide-right motion-duration-1000">
            {t("heroParagraph")}
          </p>
          <div className="motion-preset-slide-right motion-duration-1000">
            <Link
              dir="ltr"
              href="#how-it-works"
              className="inline-flex font-bold items-center bg-purple-500 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-600 transition"
            >
              {t("heroButton")} <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
        {/* Image Illustration */}
        <div className="w-full motion-preset-slide-left motion-duration-1000 md:w-1/2 mb-8 md:mb-0 relative h-64 sm:h-80 md:h-96">
          <Image
            className="rounded-3xl object-cover"
            fill
            src="/Hero.png"
            alt={t("heroImageAlt")}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
