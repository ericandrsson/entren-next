import { createClient } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";

export default async function LogoutPage() {
  const supabase = createClient();
  const router = useRouter();
  await supabase.auth.signOut();
  router.refresh();
}
