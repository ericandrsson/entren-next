"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar"; // Assuming shadcn's Avatar components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"; // Assuming shadcn's Dropdown components
import { useUser } from "@/src/hooks/useUser"; // Custom hook to access user data
import Link from "next/link";

export default function UserAvatar() {
  const { user } = useUser(); // Retrieve user from custom hook

  const userInitials = "TEST";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          {user?.user_metadata.avatar_url ? (
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.name || "User Avatar"}
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
        {/* Add more dropdown items if needed */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/logout">Logga ut</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
