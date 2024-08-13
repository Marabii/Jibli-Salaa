export const metadata = {
  title: "Buyer Page",
  description:
    "This is the buyers page designed to help users place orders in the Jiblii Salaa website. Travelers can then accept those orders and hand deliver them to their destinations.",
};

export default function BuyerLayout({ children, mappickup, sendData }) {
  return (
    <>
      <div>{children}</div>
      <div>{mappickup}</div>
      <div>{sendData}</div>
    </>
  );
}
