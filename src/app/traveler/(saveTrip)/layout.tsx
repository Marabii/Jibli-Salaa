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
      <section className="flex justify-center items-center gap-10">
        {children}
      </section>
      <section className="flex gap-5 my-10 justify-around flex-wrap">
        <div>
          <h2 className="text-2xl mb-5 text-center font-semibold text-gray-800">
            Start Location
          </h2>
          <div>{mapstart}</div>
        </div>
        <div>
          <h2 className="text-2xl mb-5 text-center font-semibold text-gray-800">
            Destination
          </h2>
          <div>{mapdestination}</div>
        </div>
      </section>
      <section>
        <div>{tripdate}</div>
        <div className="flex justify-center">{senddata}</div>
      </section>
    </>
  );
}
