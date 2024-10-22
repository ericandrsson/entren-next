"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/src/context/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderUserMenu({ initialUser }: { initialUser: User | null }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = user ?? initialUser;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!currentUser && pathname !== "/sign-in") {
    return (
      <Link href="/sign-in">
        <Button variant="default" className="text-white">
          Logga in
        </Button>
      </Link>
    );
  }

  // Early return if currentUser is still null
  if (!currentUser) {
    return null;
  }

  const userInitials = currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          {currentUser.user_metadata?.avatar_url ? (
            <AvatarImage src={currentUser.user_metadata.avatar_url} alt={currentUser.user_metadata.name || "User Avatar"} />
          ) : (
            <AvatarFallback>{userInitials}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/auth/account-settings">Mitt konto</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>Logga ut</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
