import { Toaster } from "@/src/components/ui/toaster";
import "@/src/styles/global.css";
import localFont from "next/font/local";
import CookieBanner from "./CookieBanner";
import Footer from "./Footer";
import Header from "./Header";

const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface BaseLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function BaseLayout({
  children,
  showFooter = true,
}: BaseLayoutProps) {
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
        {showFooter && <Footer />}
      </body>
    </html>
  );
}
