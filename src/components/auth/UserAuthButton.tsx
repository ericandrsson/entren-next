"use client";

import { Button } from "@/src/components/ui/button";
import { useUser } from "@/src/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect } from "react";
import UserAvatar from "./UserAvatar";

export default function UserAuthButton() {
  const { user, refreshUser } = useUser();

  useEffect(() => {
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        console.log("refreshing user");
        refreshUser();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [refreshUser]);

  return user ? (
    <UserAvatar />
  ) : (
    <Link href="/login">
      <Button variant="default" className="text-white">
        Logga in
      </Button>
    </Link>
  );
}
