"use client";
import Carousel, { SlideData } from "./carousel";

export function BestDeals() {
  const slideData: SlideData[] = [
    {
      productName: "ASUS ROG Zephyrus G16 RTX 4090",
      country1: "United Kingdom",
      country2: "USA",
      price1: 7039.06,
      price2: 4354,
      productImage: "/g16.jpg",
      linkProduct1:
        "https://www.amazon.co.uk/dp/B0DB67J77H?tag=haggle-web-en-21&linkCode=osi&th=1&language=en_GB",
      linkProduct2:
        "https://www.newegg.com/gray-asus-rog-zephyrus-g16-gu605my-gaming-entertainment/p/2WC-000N-0EHR1?srsltid=AfmBOop7bV4cVMYl9jacssplytwTm1F_ayzoK01NXRbXe7ZDBILqJDej",
    },
    {
      productName: "Apple Apple 11-inch iPad Pro",
      country1: "USA",
      country2: "Argentina",
      price1: 944,
      price2: 2427,
      productImage: "/ipadM4.webp",
      linkProduct1:
        "https://www.walmart.com/ip/Apple-11-inch-iPad-Pro-Wi-Fi-Tablet-1-TB-11-Tandem-OLED-2420-x-1668-space-black/5577276684",
      linkProduct2:
        "https://www.fravega.com/p/ipad-pro-11-wifi-cellular-256-gb-negro-espacial-990221806/",
    },
    {
      productName: "Long Castleford Trench Coat",
      country1: "United Kingdom",
      country2: "China",
      price1: 2571,
      price2: 2965.82,
      productImage: "/burberry.webp",
      linkProduct1:
        "https://uk.burberry.com/long-castleford-trench-coat-p81047111",
      linkProduct2:
        "https://www.burberry.cn/long-waterloo-heritage-trench-coat-p80794201?brbref=trench_lp_trench_pdp",
    },
    {
      productName: "LOUIS VUITTON OnTheGo MM",
      country1: "USA",
      country2: "France",
      price1: 3150,
      price2: 2773.7,
      productImage: "/louisVuitton.avif",
      linkProduct1:
        "https://us.louisvuitton.com/eng-us/products/onthego-mm-monogram-nvprod2130189v/M45321",
      linkProduct2:
        "https://us.louisvuitton.com/eng-us/products/onthego-mm-monogram-nvprod2130189v/M45321",
    },
  ];

  return (
    <div className="bg-gray-100 w-full">
      <div className="relative overflow-hidden container mx-auto px-4 w-full h-full py-20">
        <h2 className="text-4xl text-black font-bold mb-8">
          Look at how much you can save
        </h2>
        <Carousel slides={slideData} />
      </div>
    </div>
  );
}
