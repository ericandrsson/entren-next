"use client";

import UserAuthButton from "@/src/components/auth/UserAuthButton";
import Image from "next/image";
import Link from "next/link";
import { useHeader } from "../contexts/HeaderContext";

export default function Header() {
  const { isSticky } = useHeader();

  return (
    <header
      className={`w-full bg-background shadow-sm z-50 ${isSticky ? "sticky top-0" : ""}`}
    >
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/images/faster-forward-logo.png"
            alt="Faster Forward"
            width={32}
            height={32}
            className="mr-2"
          />
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-bold text-primary">
              Entren
            </Link>
            <span className="text-xs text-muted-foreground">
              en tjänst av{" "}
              <Link
                href="https://www.fasterforward.se/"
                className="hover:underline"
              >
                Faster Forward
              </Link>
            </span>
          </div>
        </div>
        <UserAuthButton />
      </div>
    </header>
  );
}
