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
    <>
      <div>{children}</div>
      <div>{mappickup}</div>
      <div>{sendData}</div>
    </>
  );
}
