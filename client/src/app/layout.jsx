import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { StoreProvider } from "@/store/StoreProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
});

export const metadata = {
  title: "Jiblii Salaa",
  description: "This is the home page of the Jiblii Salaa web application",
};

export default function RootLayout({ children }) {
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
