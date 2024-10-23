import { jwtDecode } from 'jwt-decode';
import { createClient } from '@/utils/supabase/client';

export function setupAuthListener(callback: (userRole: string | null) => void) {
  const supabase = createClient();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      const jwt = jwtDecode(session.access_token);
      const userRole = (jwt as any).user_role;
      callback(userRole);
    } else {
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}
