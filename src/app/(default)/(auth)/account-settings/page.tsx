"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useAuth } from "@/src/context/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function AccountSettings() {
  const supabase = createClient();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.user_metadata.name || "");
      setAvatarUrl(user.user_metadata.avatar_url || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name, avatar_url: avatarUrl },
      });
      if (error) throw error;
      // Add success notification logic here
    } catch (error) {
      console.error("Error updating user:", error);
      // Add error notification logic here
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Or redirect to login page
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4">Konto</h1>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Email</label>
        <Input type="email" value={user.email || ""} disabled className="w-full cursor-not-allowed bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Name</label>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Avatar URL</label>
        <Input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full" />
      </div>
      <Button onClick={handleSave} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
}
