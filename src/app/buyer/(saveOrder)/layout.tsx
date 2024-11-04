interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Buyer Page",
  description:
    "This is the buyers page designed to help users place orders in the Jiblii Salaa website. Travelers can then accept those orders and hand deliver them to their destinations.",
};

interface BuyerLayoutProps {
  children: React.ReactNode;
  mappickup: React.ReactNode;
  sendData: React.ReactNode;
}

export default function BuyerLayout({
  children,
  mappickup,
  sendData,
}: BuyerLayoutProps) {
  return (
    <div>
      <div>{children}</div>
      <div className="flex justify-around items-center flex-wrap">
        <div className="mt-5">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Choose your preferred pickup place
          </h2>
          <div className="flex justify-center mt-5">{mappickup}</div>
        </div>
        <div>{sendData}</div>
      </div>
    </div>
  );
}
