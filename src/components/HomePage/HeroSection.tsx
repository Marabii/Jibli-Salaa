import "server-only";

import { Link } from "@/i18n/navigation";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FlipWords } from "../flip-words";

export default async function HeroSection() {
  const t = await getTranslations("HomePage.HeroSection");

  const words: string[] = JSON.parse(t("flipWords"));

  return (
    <section className="bg-black text-white py-10 md:pb-16 md:pt-12">
      <div className="max-w-screen-2xl gap-5 mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Text Content */}
        <div dir="auto" className="w-full order-2 md:order-1 md:w-1/2">
          <h1
            dir="auto"
            className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4 motion-preset-slide-right motion-duration-1000"
          >
            {t("heroHeading")} <br />
            <FlipWords words={words} />
          </h1>
          <p className="text-md md:text-lg mb-8 motion-preset-slide-right motion-duration-1000">
            {t("heroParagraph")}
          </p>
          <div className="motion-preset-slide-right motion-duration-1000">
            <Link
              dir="ltr"
              href="#how-it-works"
              className="inline-flex items-center font-bold bg-purple-500 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-600 transition"
            >
              <span className="max-w-[200px]">{t("heroButton")}</span>
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Image Illustration */}
        <div className="relative w-full order-1 md:order-2 md:w-1/2 xl:w-1/3 aspect-square mb-8 md:mb-0">
          <Image
            className="rounded-3xl object-cover"
            fill
            src="/Hero3.png"
            priority
            alt={t("heroImageAlt")}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
