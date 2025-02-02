"use client";

import React from "react";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";

type OrderDetailsProps = {
  orderInfo: CompletedOrder;
};

export default function OrderDetails({ orderInfo }: OrderDetailsProps) {
  const productValue = orderInfo.actualValue || orderInfo.estimatedValue || 0;
  const deliveryFee =
    orderInfo.initialDeliveryFee || orderInfo.actualDeliveryFee || 0;

  return (
    <motion.div
      className="bg-gray-300 p-4 rounded shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-xl font-bold mb-4 text-center">Order Details</h1>
      <div className="space-y-2 text-sm p-3 rounded-md">
        {orderInfo.productName && (
          <p>
            <strong>Product:</strong> {orderInfo.productName}
          </p>
        )}
        {orderInfo.description && (
          <p>
            <strong>Description:</strong> {orderInfo.description}
          </p>
        )}
        {orderInfo.quantity && (
          <p>
            <strong>Quantity:</strong> {orderInfo.quantity}
          </p>
        )}
        {productValue > 0 && (
          <p>
            <strong>Product Price:</strong>{" "}
            {productValue.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        )}
        {deliveryFee > 0 && (
          <p>
            <strong>Delivery Fee:</strong>{" "}
            {deliveryFee.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        )}
        {orderInfo.deliveryInstructions && (
          <p>
            <strong>Delivery Instructions:</strong>{" "}
            {orderInfo.deliveryInstructions}
          </p>
        )}
        {orderInfo.placedAt && (
          <p>
            <strong>Order Placed:</strong>{" "}
            {new Date(orderInfo.placedAt).toLocaleString()}
          </p>
        )}
        {orderInfo.productURL && (
          <p className="text-blue-400 underline">
            <strong>Product URL:</strong>{" "}
            <a
              href={orderInfo.productURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Product
            </a>
          </p>
        )}
        {orderInfo.preferredPickupPlace && (
          <p>
            <strong>Pickup Place:</strong>{" "}
            {orderInfo.preferredPickupPlace.formatted_address}
          </p>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.ORDER_ACCEPTED && (
          <p className="text-green-400 font-semibold">Order Accepted</p>
        )}
        {orderInfo.images && orderInfo.images.length > 0 && (
          <>
            <strong>Images:</strong>
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {orderInfo.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-auto h-auto"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </>
        )}
      </div>
    </motion.div>
  );
}
