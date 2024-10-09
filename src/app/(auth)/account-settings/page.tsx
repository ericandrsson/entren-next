"use client";

import { Button } from "@/src/components/ui/button"; // Assuming a Button component from shadcn
import { Input } from "@/src/components/ui/input"; // Assuming an Input component from shadcn
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function AccountSettings() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata.name || "");
        setAvatarUrl(user.user_metadata.avatar_url || "");
      }
    }
    fetchUser();
  }, []);

  const handleSave = async () => {
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

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className=" mb-4">Konto</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Avatar URL</label>
        <Input
          type="text"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full"
        />
      </div>
      <Button onClick={handleSave} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
}
