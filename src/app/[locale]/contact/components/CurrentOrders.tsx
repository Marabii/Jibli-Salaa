"use client";

import { JSX, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactDOM from "react-dom";
import useOutsideClick from "@/hooks/useOutsideClick";
import { CompletedOrder } from "@/interfaces/Order/order";
import { format } from "currency-formatter";
import LoadingSpinner from "@/components/Loading/LoadingSpinner2/LoadingSpinner2";
import { useTranslations } from "next-intl";
import { ContactDetails } from "../page";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { ExchangeRate } from "@/interfaces/userInfo/userInfo";

interface Card {
  orderId: string;
  contactId: string;
  contactName: string;
  priceDetails: string;
  title: string;
  src: string;
  ctaLink: string;
  content: () => JSX.Element;
}

export default function CurrentOrders({
  contactDetails,
  userCurrency,
}: {
  contactDetails: ContactDetails[];
  userCurrency: string;
}) {
  const [active, setActive] = useState<Card | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const t = useTranslations("HomePage.OnlineTransactions.CurrentOrders");

  // Fetch cards when orders or selected currency change
  useEffect(() => {
    async function fetchCards() {
      const generatedCards = await generateCards({
        contactDetails,
        userCurrency,
        t,
      });
      setCards(generatedCards);
      setLoading(false);
    }
    fetchCards();
  }, [contactDetails, t, userCurrency]);

  // Handle Escape key and body scrolling when a card is active
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  if (loading) {
    return (
      <div className="w-fit order-2 md:order-1 h-fit sticky top-0 py-20 mx-auto">
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit order-2 md:order-1 h-fit mx-auto">
      <AnimatePresence>
        {active && (
          <Modal>
            <div className="fixed z-50 inset-0 grid place-items-center">
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${active.title}-${id}`}
                ref={ref}
                className="w-full max-w-[500px] md:max-h-[90%] h-fit flex flex-col bg-neutral-900 sm:rounded-3xl overflow-hidden"
              >
                <motion.div layoutId={`image-${active.title}-${id}`}>
                  <Image
                    priority
                    width={200}
                    height={200}
                    src={active.src}
                    alt={active.title}
                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                </motion.div>
                <div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <div>
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="font-bold text-neutral-200"
                      >
                        {active.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${active.priceDetails}-${id}`}
                        className="text-neutral-400"
                      >
                        {active.priceDetails}
                      </motion.p>
                    </div>
                    <motion.a
                      layoutId={`button-${active.title}-${id}`}
                      href={`/negotiate?orderId=${active.orderId}&recipientId=${active.contactId}`}
                      className="px-4 py-3 text-nowrap text-sm rounded-full font-bold bg-purple-600 text-white"
                    >
                      Negotiate with {active.contactName}
                    </motion.a>
                  </div>
                  <div className="pt-4 relative px-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs md:text-sm lg:text-base h-72 md:max-h-full pb-10 flex flex-col items-start gap-4 overflow-auto text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                    >
                      {active.content()}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <ul className="max-w-2xl space-y-2 w-full gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex space-x-3 flex-col md:flex-row justify-between items-center bg-neutral-800 rounded-xl cursor-pointer"
            style={{
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div
                className="flex items-center justify-center"
                layoutId={`image-${card.title}-${id}`}
                style={{
                  willChange: "transform, opacity",
                  transform: "translateZ(0)",
                }}
              >
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.priceDetails}-${id}`}
                  className="text-neutral-400 max-w-sm text-balance text-center md:text-left"
                >
                  {card.priceDetails}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-purple-600 hover:text-white text-black mt-4 md:mt-0"
            >
              {t("moreInfo")}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

function Modal({ children }: { children: React.ReactNode }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative grid place-items-center h-full">{children}</div>
    </div>,
    document.body
  );
}

interface GenerateCardsParams {
  contactDetails: ContactDetails[];
  userCurrency: string;
  t: (key: string, options?: any) => string;
}

async function generateCards({
  contactDetails,
  userCurrency,
  t,
}: GenerateCardsParams): Promise<Card[]> {
  const exchangeRateCache: { [sourceCurrency: string]: ExchangeRate } = {};

  const uniqueCurrencies = Array.from(
    new Set(contactDetails.map((contactInfo) => contactInfo.orderInfo.currency))
  );

  await Promise.all(
    uniqueCurrencies.map(async (sourceCurrency) => {
      const response: ApiResponse<ExchangeRate> = await apiClient(
        `/api/exchange-rate?target=${userCurrency}&source=${sourceCurrency}`
      );
      exchangeRateCache[sourceCurrency] = response.data;
    })
  );

  return contactDetails.map((contactInfo) => {
    const orderInfo = contactInfo.orderInfo;
    const exchangeRate = exchangeRateCache[orderInfo.currency];

    const productValue =
      (orderInfo.actualValue || orderInfo.estimatedValue) * exchangeRate.rate;
    const deliveryFee =
      (orderInfo.actualDeliveryFee || orderInfo.initialDeliveryFee) *
      exchangeRate.rate;

    return {
      priceDetails: `Product price: ${format(productValue, {
        code: exchangeRate.target,
      })}, \n Delivery fee: ${format(deliveryFee, {
        code: exchangeRate.target,
      })}`,
      title: orderInfo.productName,
      src: orderInfo.images[0],
      contactId: contactInfo.contactId,
      contactName: contactInfo.contactName,
      orderId: orderInfo._id!,
      ctaLink: orderInfo.productURL || "",
      content: () => {
        return (
          <div
            dir="auto"
            className="bg-neutral-800 w-full p-4 md:p-6 rounded-3xl shadow-2xl text-white"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center border-b border-gray-600 pb-2">
              {t("orderDetails")}
            </h1>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base p-2 sm:p-4 rounded-md">
              {orderInfo.description && (
                <p>
                  <span className="font-bold">{t("description")}</span>{" "}
                  {orderInfo.description}
                </p>
              )}
              {orderInfo.quantity && (
                <p>
                  <span className="font-bold">{t("quantity")}</span>{" "}
                  {orderInfo.quantity}
                </p>
              )}
              {productValue > 0 && (
                <p>
                  <span className="font-bold">{t("productPrice")}</span>{" "}
                  {format(Number(productValue.toFixed(2)), {
                    code: orderInfo.currency,
                  })}
                </p>
              )}
              {orderInfo.deliveryInstructions && (
                <p>
                  <span className="font-bold">{t("deliveryInstructions")}</span>{" "}
                  {orderInfo.deliveryInstructions}
                </p>
              )}
              {orderInfo.productURL && (
                <p className="text-blue-400 underline">
                  <span className="font-bold">{t("productLink")}</span>{" "}
                  <a
                    href={orderInfo.productURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("viewProduct")}
                  </a>
                </p>
              )}
              {orderInfo.preferredPickupPlace && (
                <p>
                  <span className="font-bold">{t("pickupPlace")}</span>{" "}
                  {orderInfo.preferredPickupPlace.formatted_address}
                </p>
              )}
            </div>
          </div>
        );
      },
    };
  });
}
