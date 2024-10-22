"use server";

import AuthFlowComponent from "@/src/components/auth/AuthFlowComponent";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

async function handleAuth(formData: FormData) {
  "use server";

  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error);
    throw new Error("Felaktigt användarnamn eller lösenord");
  } else {
    return { success: true };
  }
}

async function checkEmailExists(email: string) {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase.rpc("check_email_exists", { email });

  if (error) {
    console.error("Error checking email:", error);
    throw new Error("Ett fel uppstod vid kontroll av e-postadressen");
  }

  return data;
}

async function handleRequestResetPassword(formData: FormData) {
  "use server";

  const supabase = createClient();
  const email = formData.get("email") as string;

  const headersList = headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-password`,
  });

  if (error) {
    console.error("Error requesting password reset:", error);
    throw new Error("Ett fel uppstod vid begäran om återställning av lösenord");
  } else {
    return { success: true };
  }
}

async function handleResetPassword(formData: FormData) {
  "use server";

  const cookie = cookies().get("auth")?.value;

  if (!cookie || cookie !== "ALLOWED_TO_RESET_PASSWORD") {
    redirect("/sign-in");
  }

  const supabase = createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }

  // Delete the auth cookie after successful password reset
  cookies().delete("auth");

  return { success: true };
}

export default async function AuthFlow() {
  return (
    <div className="sm:grow sm:flex sm:justify-center sm:items-start sm:px-4 lg:px-0 bg-background">
      <AuthFlowComponent
        onSubmit={handleAuth}
        checkEmailExists={checkEmailExists}
        onRequestResetPassword={handleRequestResetPassword}
        onResetPassword={handleResetPassword}
      />
    </div>
  );
}
