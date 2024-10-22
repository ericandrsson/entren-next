"use server";

import AuthFlowComponent from "@/src/components/auth/AuthFlowComponent";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function handleAuth(prevState: any, formData: FormData) {
  "use server";

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: "Felaktigt användarnamn eller lösenord" };
  }

  redirect("/");
}

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

  // Redirect to login page with URL-encoded success message
  const message = encodeURIComponent("Instruktioner för återställning av lösenord har skickats till din e-post");
  redirect(`/sign-in?message=${message}`);
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
    console.log("error ", error);
    console.log(error.status);
    if (error.status === 422 && error.code === "same_password") {
      return { success: false, message: "Det nya lösenordet måste vara annorlunda än ditt nuvarande lösenord." };
    }
    return { success: false, message: "Ett fel uppstod vid återställning av lösenordet. Vänligen försök igen." };
  }

  // Delete the auth cookie after successful password reset
  cookieStore.delete("auth");

  // Redirect to login page with success message
  redirect("/sign-in?message=Lösenordet har återställts framgångsrikt");
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

  return { message: "Registrering lyckades. Kontrollera din e-post för verifiering.", success: true };
}

export default async function AuthFlow({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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
    <div className="sm:grow sm:flex sm:justify-center sm:items-start sm:px-4 lg:px-0 bg-background">
      <AuthFlowComponent
        handleAuth={handleAuth}
        handleRequestResetPassword={handleRequestResetPassword}
        handleResetPasswordAction={handleResetPassword}
        handleSignUp={handleSignUp}
        initialFormState={initialFormState}
      />
    </div>
  );
}
