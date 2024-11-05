"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { useAuth } from "@/src/context/auth-provider";
import { Camera, ChevronRight, KeyRound, LogOut, Mail, Trash2, UserCog } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function AccountSettings() {
  const { user, signOut } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    signOut();
    redirect("/");
  };

  return (
    <Card className="m-auto w-screen overflow-y-auto rounded-none bg-card shadow-none sm:max-h-[calc(100vh-112px)] sm:max-w-md sm:rounded-lg sm:shadow-lg sm:shadow-zinc-500/10">
      <CardHeader>
        <CardTitle>Kontoinställningar</CardTitle>
        <CardDescription>Hantera dina kontoinställningar och preferenser</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={avatar || "/placeholder.svg?height=128&width=128"} alt="Användarens avatar" />
            <AvatarFallback>EA</AvatarFallback>
          </Avatar>
          <div className="relative">
            <Input
              type="file"
              id="avatar-upload"
              className="sr-only"
              accept="image/*"
              onChange={handleAvatarChange}
              aria-label="Ladda upp avatar"
            />
            <Label
              htmlFor="avatar-upload"
              className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium text-primary hover:bg-muted"
            >
              <Camera className="h-4 w-4" />
              Ändra Avatar
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>E-post</Label>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
          <div className="space-y-2">
            <Label>Namn</Label>
            <div className="text-sm text-muted-foreground">{user?.name}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Link
            href="/account/edit"
            className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>Redigera kontodetaljer</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>

          <Link
            href="/account/password"
            className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              <span>Ändra lösenord</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>

          <Link
            href="/account/email"
            className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Ändra e-post</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>

          <Separator />

          <Link
            href="/account-settings/delete"
            className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-destructive/10 hover:text-destructive"
          >
            <div className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              <span>Radera konto</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>

          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logga ut
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
