"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/src/context/AuthProvider";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function HeaderUserMenu({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const { user } = useAuth();
  const currentUser = user ?? initialUser;

  if (!currentUser) {
    return (
      <Link href="/auth/login">
        <Button variant="default" className="text-white">
          Logga in
        </Button>
      </Link>
    );
  }

  const userInitials = currentUser.email
    ? currentUser.email.substring(0, 2).toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          {currentUser.user_metadata.avatar_url ? (
            <AvatarImage
              src={currentUser.user_metadata.avatar_url}
              alt={currentUser.user_metadata.name || "User Avatar"}
            />
          ) : (
            <AvatarFallback>{userInitials}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/account-settings">Mitt konto</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/logout">Logga ut</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
