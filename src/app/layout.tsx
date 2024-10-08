import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/src/styles/global.css";
import { Toaster } from "@/src/components/ui/toaster";
import CookieBanner from "./_components/CookieBanner";
import Header  from "../components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <div className="flex flex-col h-screen">
          <Header />
          {children}
          <footer className="w-full bg-white shadow-sm mt-auto">
            <div className="mx-auto px-4 py-4 flex justify-center items-center">
              <p className="text-sm text-gray-600">
                © 2024 Entren. All rights reserved.
              </p>
            </div>
          </footer>
          <Toaster />
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
