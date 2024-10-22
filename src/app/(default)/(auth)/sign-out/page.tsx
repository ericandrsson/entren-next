"use client";

import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function SignOutPage() {
  const supabase = createClient();

  supabase.auth.signOut();

  revalidatePath("/", "layout");
  return redirect("/?signedOut=true");
}
