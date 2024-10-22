"use server";

import AuthFlowComponent from "@/src/components/auth/AuthFlowComponent";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function handleAuth(prevState: any, formData: FormData) {
  "use server";

  const supabase = createClient();
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

async function checkEmailExists(email: string) {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase.rpc("check_email_exists", { email });

  if (error) {
    throw new Error("Ett fel uppstod vid kontroll av e-postadressen");
  }

  return data;
}

async function handleRequestResetPassword(prevState: any, formData: FormData) {
  "use server";

  const supabase = createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return {
      message: "Ett fel uppstod vid begäran om återställning av lösenord",
      success: false,
    };
  }

  return {
    message:
      "Instruktioner för återställning av lösenord har skickats till din e-post",
    success: true,
  };
}

async function handleResetPassword(prevState: any, formData: FormData) {
  "use server";

  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");

  if (authCookie?.value !== "ALLOWED_TO_RESET_PASSWORD") {
    redirect("/sign-in");
  }

  const supabase = createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { message: error.message };
  }

  // Delete the auth cookie after successful password reset
  cookieStore.delete("auth");

  redirect("/sign-in?mode=reset-success");
}

export default async function AuthFlow({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const mode = searchParams.mode as string | undefined;
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");

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
        checkEmailExists={checkEmailExists}
        handleRequestResetPassword={handleRequestResetPassword}
        handleResetPasswordAction={handleResetPassword} // Updated prop name
        initialFormState={initialFormState}
      />
    </div>
  );
}
