import Header from "@/src/components/header/Header";
import { Toaster } from "@/src/components/ui/toaster";
import { AuthProvider } from "@/src/context/AuthProvider";
import "@/src/styles/global.css";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import localFont from "next/font/local";
import CookieBanner from "../../components/CookieBanner";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#f1f3f4" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans flex flex-col h-full overflow-hidden`}
      >
        <AuthProvider>
          <Header user={user} />
          <main className="flex-grow overflow-hidden">{children}</main>
          <Toaster />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
