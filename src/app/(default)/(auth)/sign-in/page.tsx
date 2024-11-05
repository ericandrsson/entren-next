"use server";

import AuthFlowComponent from "@/src/components/auth/auth-flow";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const handleLogin = async (email: string, password: string) => {
  "use server";

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("error", error);

  if (error) {
    if (error.status === 400 && error.message === "Email not confirmed") {
      return { success: false, message: "Din e-post har inte verifierats. Kontrollera din inkorg och försök igen." };
    } else if (error.status === 400 && error.message === "Invalid login credentials") {
      return { success: false, message: "Felaktigt användarnamn eller lösenord" };
    } else {
      return { success: false, message: "Ett fel uppstod vid inloggningen. Vänligen försök igen." };
    }
  }

  return { success: true, message: "Inloggning lyckades" };
};

export async function checkEmailExists(email: string) {
  "use server";

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_email_exists", { email });

  if (error) {
    console.error("Error checking email:", error);
    return { exists: false, message: "Ett fel uppstod vid kontroll av e-postadressen" };
  }

  return { exists: !!data, message: "" };
}

async function handleRequestResetPassword(prevState: any, formData: FormData) {
  "use server";

  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return {
      message: "Ett fel uppstod vid begäran om återställning av lösenord",
      success: false,
    };
  }

  // Redirect to login page with URL-encoded confirmation message
  const message = encodeURIComponent("Instruktioner för återställning av lösenord har skickats till din e-post");
  redirect(`/sign-in?confirmationMessage=${message}`);
}

async function handleResetPassword(prevState: any, formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const authCookie = await cookieStore.get("auth");

  if (authCookie?.value !== "ALLOWED_TO_RESET_PASSWORD") {
    redirect("/sign-in");
  }

  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    if (error.status === 422 && error.code === "same_password") {
      return { success: false, message: "Det nya lösenordet måste vara annorlunda än ditt nuvarande lösenord." };
    }
    return { success: false, message: "Ett fel uppstod vid återställning av lösenordet. Vänligen försök igen." };
  }

  // Delete the auth cookie after successful password reset
  cookieStore.delete("auth");

  // Redirect to login page with success message
  const message = encodeURIComponent("Lösenordet har återställts framgångsrikt");
  redirect(`/sign-in?message=${message}`);
}

async function handleSignUp(prevState: any, formData: FormData) {
  "use server";

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { message: "Ett fel uppstod vid registrering", success: false };
  }

  // Redirect to login page with URL-encoded confirmation message
  const message = encodeURIComponent("Registrering lyckades. Kontrollera din e-post för verifiering.");
  redirect(`/sign-in?confirmationMessage=${message}`);
}

export default async function AuthFlow({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { mode } = await searchParams;
  const cookieStore = await cookies();
  const authCookie = await cookieStore.get("auth");

  let initialFormState;

  switch (mode) {
    case "reset-password":
      if (authCookie?.value !== "ALLOWED_TO_RESET_PASSWORD") {
        redirect("/sign-in");
      }
      initialFormState = "RESET_PASSWORD";
      break;
    case "sign-up":
      initialFormState = "SIGN_UP";
      break;
    case "request-reset-password":
      initialFormState = "REQUEST_RESET_PASSWORD";
      break;
    default:
      initialFormState = "SIGN_IN";
  }

  return (
    <div className="bg-background sm:flex sm:grow sm:items-start sm:justify-center sm:px-4 lg:px-0">
      <AuthFlowComponent
        handleRequestResetPassword={handleRequestResetPassword}
        handleResetPasswordAction={handleResetPassword}
        handleSignUp={handleSignUp}
        initialFormState={initialFormState}
      />
    </div>
  );
}
