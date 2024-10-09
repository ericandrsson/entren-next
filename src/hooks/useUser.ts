import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface UseUser {
  user: User | null;
  refreshUser: () => void;
}

export function useUser(): UseUser {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  useEffect(() => {
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshUser = () => {
    fetchUser();
  };

  return { user, refreshUser };
}