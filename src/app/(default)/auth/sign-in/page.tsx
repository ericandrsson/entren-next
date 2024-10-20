"use client";

import EmailOtpForm from "@/src/components/auth/EmailOtpForm";
import GoogleSignInButton from "@/src/components/auth/GoogleSignInButton";
import { RequestResetPasswordForm } from "@/src/components/auth/RequestResetPasswordForm";
import { SignInForm } from "@/src/components/auth/SignInForm";
import { SignUpForm } from "@/src/components/auth/SignUpForm";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
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
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<SignInFormState>(
    SignInFormState.EmailOtp,
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      setFormState(SignInFormState.ResetPassword);
    }
  }, [searchParams]);

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error logging in:", error);
      setLoginError("Felaktigt användarnamn eller lösenord");
    } else {
      router.push("/");
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    subscribeNewsletter: boolean,
    acceptTerms: boolean,
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
        data: {
          subscribeNewsletter,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error);
      if (error.message === "User already registered") {
        setLoginError(
          "Den här e-postadressen är redan registrerad. Försök logga in istället.",
        );
      } else {
        setLoginError("Det gick inte att skapa kontot. Försök igen senare.");
      }
    } else {
      setVerificationSent(true);
      setLoginError(null);
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

      setVerificationSent(true);
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      setLoginError(
        "Det gick inte att skicka inloggningslänken. Försök igen senare.",
      );
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="w-full max-w-md p-6 space-y-6">
        <h1 className="font-bold text-2xl text-primary">
          {formState === SignInFormState.CreateAccount
            ? "Skapa konto på Entren"
            : formState === SignInFormState.ResetPassword
              ? "Glömt ditt lösenord?"
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
          formState !== SignInFormState.ResetPassword && (
            <h3 className="font-semibold text-muted-foreground">
              Välkommen tillbaka! Logga in eller skapa ett nytt konto.
            </h3>
          )
        )}

        {formState === SignInFormState.ResetPassword && (
          <RequestResetPasswordForm
            onCancel={() => setFormState(SignInFormState.EmailOtp)}
          />
        )}

        {formState === SignInFormState.EmailPassword && (
          <SignInForm
            onSubmit={handleSignIn}
            onResetPassword={() => setFormState(SignInFormState.ResetPassword)}
            loginError={loginError}
          />
        )}

        {formState === SignInFormState.CreateAccount && (
          <SignUpForm
            onSubmit={handleSignUp}
            loginError={loginError}
            verificationSent={verificationSent}
          />
        )}

        {formState === SignInFormState.EmailOtp && (
          <EmailOtpForm
            onSubmit={handleOtpLogin}
            formState={formState}
            loginError={loginError}
            verificationSent={verificationSent}
          />
        )}

        {formState !== SignInFormState.ResetPassword && (
          <>
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
