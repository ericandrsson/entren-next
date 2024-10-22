import AuthFlowComponent from "@/src/components/auth/AuthFlowComponent";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

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
  const { data, error } = await supabase.rpc('check_email_exists', { email });

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

export default function AuthFlow() {
  return (
    <div className="sm:grow sm:flex sm:justify-center sm:items-start sm:px-4 lg:px-0 bg-background">
      <AuthFlowComponent 
        onSubmit={handleAuth} 
        checkEmailExists={checkEmailExists}
        onRequestResetPassword={handleRequestResetPassword}
      />
    </div>
  );
}
