"use client";

import UserAuthButton from "@/src/components/auth/UserAuthButton";
import { useStore } from "@/src/libs/store";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const isStickyHeader = useStore((state) => state.isStickyHeader);

  return (
    <header
      className={`w-full bg-background shadow-sm z-50 ${isStickyHeader ? "" : ""}`}
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
