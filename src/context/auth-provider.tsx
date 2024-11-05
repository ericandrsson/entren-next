"use client";

import { createClient } from "@/utils/supabase/client";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { AppRole, CustomJwtPayload } from "../types/custom.types";

const AuthContext = createContext<{
  session: Session | null | undefined;
  user: User | null | undefined;
  userRole: AppRole | null | undefined;
  signOut: () => void;
}>({ session: null, user: null, userRole: null, signOut: () => {} });

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const [userRole, setUserRole] = useState<AppRole>();
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      const jwt = jwtDecode<CustomJwtPayload>(session?.access_token ?? "");
      const userRole = jwt.user_role;
      setUserRole(userRole as AppRole);
      setSession(session);
      setUser(session?.user);
      setLoading(false);
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    session,
    user,
    userRole,
    signOut: async () => await supabase.auth.signOut(),
  };

  // use a provider to pass down the value
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
