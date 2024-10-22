import AuthFlowComponent from "@/src/components/auth/AuthFlowComponent";
import { createClient } from "@/utils/supabase/server";

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

export default function AuthFlow() {
  return (
    <div className="sm:grow sm:flex sm:justify-center sm:items-start sm:px-4 lg:px-0 bg-background">
      <AuthFlowComponent onSubmit={handleAuth} checkEmailExists={checkEmailExists} />
    </div>
  );
}
