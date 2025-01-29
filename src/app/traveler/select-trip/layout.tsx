interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Select Trip",
  description: "The traveler selects one of their scheduled trips",
};

export default function SelectTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
