"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/Carousel/carousel";
import ImageModalWrapper from "@/components/ImageModalWrapper";
import { CompletedOrder } from "@/interfaces/Order/order";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function ImgsCarousel({ order }: { order: CompletedOrder }) {
  return (
    <Carousel
      dir="ltr"
      className="w-full"
      opts={{ duration: 50 }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {order.images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative h-80 w-full p-4 rounded-lg overflow-hidden shadow-lg">
              <ImageModalWrapper
                height={320}
                src={image}
                alt={`Product Image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  fill
                  // Using objectFit "cover" ensures the image is clipped to fit its container
                  // while preserving its original aspect ratio.
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  className="transition-transform duration-300 transform hover:scale-105 rounded-t-lg"
                />
              </ImageModalWrapper>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-white text-gray-800 hover:bg-gray-300 p-2 rounded-full" />
      <CarouselNext className="bg-white text-gray-800 hover:bg-gray-300 p-2 rounded-full" />
    </Carousel>
  );
}
