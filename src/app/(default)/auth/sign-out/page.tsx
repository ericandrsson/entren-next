"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function SignOutPage() {
  const supabase = createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  return redirect("/?signedOut=true");
}

