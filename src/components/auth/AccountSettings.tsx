"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useUser } from "@/src/hooks/useUser"; // Custom hook to access user data
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"; // If needed for additional settings

export default function AccountSettings() {
  const { user, refreshUser } = useUser(); // Assuming refreshUser updates the user data
  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name, avatar_url: avatarUrl },
      });
      if (error) throw error;
      setSuccess("Dina ändringar har sparats.");
      refreshUser(); // Refresh user data after update
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Ett fel uppstod vid uppdatering av användaruppgifter.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="mb-4">Konto</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
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
        <label className="block text-sm font-medium mb-1">Namn</label>
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
      <Button onClick={handleSave} className="mt-4" disabled={isLoading}>
        {isLoading ? "Sparar..." : "Spara Ändringar"}
      </Button>
    </div>
  );
}