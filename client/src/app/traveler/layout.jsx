export const metadata = {
  title: "traveler",
  description:
    "This is the traveler page of the Jiblii Salaa where travelers specify the start and end locations of their trip as well as other information to include them in the algorithm",
};

export default function TravelerTripLayout({
  mapstart,
  spokenlanguages,
  tripdate,
  mapdestination,
  internationaltrip,
  senddata,
}) {
  return (
    <>
      <div>{mapstart}</div>
      <div>{mapdestination}</div>
      <div>{spokenlanguages}</div>
      <div>{tripdate}</div>
      <div>{internationaltrip}</div>
      <div>{senddata}</div>
    </>
  );
}
