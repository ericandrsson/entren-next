import { CustomJwtPayload } from "@/src/types/custom.types";
import { createServerClient } from "@supabase/ssr";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function getUserRole() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  let userRole = null;
  if (data.session) {
    const jwt = jwtDecode<CustomJwtPayload>(data.session.access_token);
    userRole = jwt.user_role;
  }
  return userRole;
}

export async function createClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });

  return supabase;
}
