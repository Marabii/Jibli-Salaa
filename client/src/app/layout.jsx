import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jiblii Salaa",
  description: "This is the home page of the Jiblii Salaa web application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} p-4`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
