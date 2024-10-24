interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "traveler",
  description:
    "This is the traveler page of the Jiblii Salaa where travelers specify the start and end locations of their trip as well as other information to include them in the algorithm",
};

interface TravelerTripLayoutProps {
  mapstart: React.ReactNode;
  tripdate: React.ReactNode;
  mapdestination: React.ReactNode;
  senddata: React.ReactNode;
  children: React.ReactNode;
}

export default function TravelerTripLayout({
  mapstart,
  tripdate,
  mapdestination,
  senddata,
  children,
}: TravelerTripLayoutProps) {
  return (
    <>
      <div>{children}</div>
      <div>{mapstart}</div>
      <div>{mapdestination}</div>
      <div>{tripdate}</div>
      <div>{senddata}</div>
    </>
  );
}
