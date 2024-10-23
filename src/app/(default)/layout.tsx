import Header from "@/src/components/header/Header";
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
  title: "Entrén",
  description: "Entrén is a platform for finding and sharing local events and places.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f1f3f4" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <main className="h-screen w-screen">
          <div className="relative flex h-screen w-screen flex-col overflow-x-hidden sm:overflow-hidden">
            <Header user={null} />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
