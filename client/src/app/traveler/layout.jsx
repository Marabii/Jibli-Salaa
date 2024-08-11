export const metadata = {
  title: "traveler",
  description:
    "This is the traveler page of the Jiblii Salaa where travelers specify the start and end locations of their trip as well as other information to include them in the algorithm",
};

export default function RootLayout({ children, form }) {
  return (
    <>
      <div>{children}</div>
      <div>{form}</div>
    </>
  );
}
