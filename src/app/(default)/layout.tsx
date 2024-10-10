import CookieBanner from "@/src/components/CookieBanner";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import { Toaster } from "@/src/components/ui/toaster";
import "@/src/styles/global.css";
import type { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Entren",
  description:
    "Entren is a platform for finding and sharing local events and places.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f1f3f4" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow overflow-y-auto">{children}</main>
        <Toaster />
        <CookieBanner />
        <Footer />
      </body>
    </html>
  );
}