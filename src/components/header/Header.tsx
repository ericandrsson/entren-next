"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import HeaderUserMenu from "./HeaderUserMenu";

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="z-50 w-full bg-card shadow-sm">
      <div className="mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <Image src="/images/faster-forward-logo.png" alt="Faster Forward" width={32} height={32} className="mr-2" />
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-bold text-primary">
              Entrén
            </Link>
            <span className="text-xs text-muted-foreground">
              en tjänst av{" "}
              <Link href="https://www.fasterforward.se/" className="hover:underline">
                Faster Forward
              </Link>
            </span>
          </div>
        </div>
        <HeaderUserMenu initialUser={user} />
      </div>
    </header>
  );
}
