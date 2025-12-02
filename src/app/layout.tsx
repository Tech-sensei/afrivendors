import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/global/Footer";

const unboundedSans = Unbounded({
  variable: "--font-unbounded-sans",
  subsets: ["latin"],
});

const unageo = localFont({
  src: [
    { path: "../../public/fonts/Unageo/Unageo-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Semibold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Extrabold.ttf", weight: "800", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-unageo-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Afrivendors ",
  description: "Connecting African Vendors to the World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${unboundedSans.variable} ${unageo.variable} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
