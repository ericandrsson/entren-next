"use client";

import EmailOtpForm from "@/src/components/auth/EmailOtpForm";
import EmailPasswordForm from "@/src/components/auth/EmailPasswordForm";
import GoogleSignInButton from "@/src/components/auth/GoogleSignInButton";
import { RequestResetPasswordForm } from "@/src/components/auth/RequestResetPasswordForm";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { useToast } from "@/src/hooks/use-toast";
import { LoginFormValues } from "@/src/lib/schemas/auth";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export enum SignInFormState {
  EmailOtp = "EMAIL_OTP",
  EmailPassword = "EMAIL_PASSWORD",
  CreateAccount = "CREATE_ACCOUNT",
  ResetPassword = "RESET_PASSWORD",
}

export default function SignInPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<SignInFormState>(
    SignInFormState.EmailOtp,
  );
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const storedToast = localStorage.getItem("authToast");
    if (storedToast) {
      const toastData = JSON.parse(storedToast);
      toast(toastData);
      localStorage.removeItem("authToast");
    }

    if (searchParams.get("reset") === "true") {
      setFormState(SignInFormState.ResetPassword);
    }
  }, [toast, searchParams]);

  const handleSubmit = async (
    values: LoginFormValues,
    currentFormState: SignInFormState,
  ) => {
    switch (currentFormState) {
      case SignInFormState.CreateAccount:
        await handleSignUp(values);
        break;
      case SignInFormState.EmailPassword:
        await handlePasswordLogin(values);
        break;
      case SignInFormState.EmailOtp:
        await handleOtpLogin(values);
        break;
    }
  };

  const handleSignUp = async (values: LoginFormValues) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password as string,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
        data: {
          subscribeNewsletter: values.subscribeNewsletter,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Fel vid skapande av konto",
        description: "Det gick inte att skapa kontot. Försök igen senare.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Konto skapat",
        description:
          "Ditt konto har skapats framgångsrikt. Kolla din e-post för verifieringslänk.",
        variant: "default",
      });
    }
  };

  const handlePasswordLogin = async (values: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password as string,
    });
    if (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Inloggningsfel",
        description: "Felaktigt användarnamn eller lösenord",
        variant: "destructive",
      });
    } else {
      localStorage.setItem(
        "authToast",
        JSON.stringify({
          title: "Välkommen tillbaka!",
          description: "Du har loggats in.",
          variant: "default",
        }),
      );
      router.push("/");
    }
  };

  const handleOtpLogin = async (values: LoginFormValues) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      toast({
        title: "Inloggningslänk skickad",
        description: "Kolla din e-post för en länk att logga in med.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      toast({
        title: "Fel vid inloggning",
        description:
          "Det gick inte att skicka inloggningslänken. Försök igen senare.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full max-w-md p-6 space-y-6">
        {formState === SignInFormState.ResetPassword ? (
          <RequestResetPasswordForm
            onCancel={() => setFormState(SignInFormState.EmailOtp)}
          />
        ) : (
          <>
            <h1 className="font-bold text-2xl text-primary">
              {formState === SignInFormState.CreateAccount
                ? "Skapa konto på Entren"
                : "Logga in"}
            </h1>
            {formState === SignInFormState.CreateAccount ? (
              <p className="text-sm text-muted-foreground">
                Har du redan ett konto?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setFormState(SignInFormState.EmailOtp)}
                >
                  Logga in här
                </Button>
              </p>
            ) : (
              <h3 className="font-semibold text-muted-foreground">
                Välkommen tillbaka! Logga in eller skapa ett nytt konto.
              </h3>
            )}

            {formState === SignInFormState.EmailPassword ? (
              <EmailPasswordForm
                onSubmit={(values) => handleSubmit(values, formState)}
                onResetPassword={() =>
                  setFormState(SignInFormState.ResetPassword)
                }
              />
            ) : (
              <EmailOtpForm
                onSubmit={(values) => handleSubmit(values, formState)}
                formState={formState}
              />
            )}

            <div className="relative my-6">
              <Separator className="w-full" />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-muted-foreground bg-white">
                eller
              </span>
            </div>

            <GoogleSignInButton />

            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() =>
                setFormState(
                  formState === SignInFormState.EmailPassword
                    ? SignInFormState.EmailOtp
                    : SignInFormState.EmailPassword,
                )
              }
            >
              {formState === SignInFormState.EmailPassword
                ? "Logga in utan lösenord"
                : "Logga in med lösenord"}
            </Button>

            {formState !== SignInFormState.CreateAccount && (
              <Button
                variant="link"
                className="w-full mt-3"
                onClick={() => setFormState(SignInFormState.CreateAccount)}
              >
                Skapa konto
              </Button>
            )}

            <p className="text-xs text-center text-muted-foreground mt-6">
              Så hanterar vi dina{" "}
              <a href="#" className="text-primary hover:underline">
                personuppgifter
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
