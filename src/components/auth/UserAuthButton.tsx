"use client";

import { Button } from "@/src/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import { useUser } from "@/src/hooks/useUser";

export default function UserAuthButton() {
  const { user } = useUser();

  return user ? <UserAvatar /> : (
    <Link href="/login">
      <Button variant="default" className="text-white">
        Logga in
      </Button>
    </Link>
  );
}
