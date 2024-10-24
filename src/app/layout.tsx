import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { StoreProvider } from "@/store/StoreProvider";
import { ReactNode } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
});

interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Jiblii Salaa",
  description: "This is the home page of the Jiblii Salaa web application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${poppins.className} p-4`}>
          <Header />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
