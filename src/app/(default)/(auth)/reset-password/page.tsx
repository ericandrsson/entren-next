import AuthFlowComponent from "@/src/components/auth/AuthFlowComponent";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

async function resetPassword(formData: FormData) {
  "use server";

  const supabase = createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

async function handleAuth(formData: FormData) {
  // This is a placeholder. In a real scenario, you might not need this for the reset password page.
  return { success: true };
}

async function checkEmailExists(email: string) {
  // This is a placeholder. In a real scenario, you might not need this for the reset password page.
  return true;
}

async function handleRequestResetPassword(formData: FormData) {
  // This is a placeholder. In a real scenario, you might not need this for the reset password page.
  return { success: true };
}

export default function ResetPasswordPage() {
  const headersList = headers();
  const fullUrl = headersList.get("x-url") || "";
  const urlObject = new URL(fullUrl);
  console.log("urlObject ", urlObject);

  return (
    <div className="sm:grow sm:flex sm:justify-center sm:items-start sm:px-4 lg:px-0 bg-background">
      <AuthFlowComponent
        onSubmit={handleAuth}
        checkEmailExists={checkEmailExists}
        onRequestResetPassword={handleRequestResetPassword}
        onResetPassword={resetPassword}
      />
    </div>
  );
}
