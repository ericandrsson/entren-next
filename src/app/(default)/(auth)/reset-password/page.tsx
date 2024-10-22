import { ResetPasswordForm } from "@/src/components/auth/ResetPasswordForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default function ResetPasswordPage() {
  async function resetPassword(password: string) {
    "use server";

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: error.message };
    }

    redirect("/auth/sign-in?mode=email-password");
  }

  return <ResetPasswordForm resetPassword={resetPassword} />;
}
