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
import { Lock, Mail } from "lucide-react";
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
  const router = useRouter();
  const supabase = createClient();

  const [formState, setFormState] = useState<SignInFormState>(
    SignInFormState.EmailOtp,
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    const mode = searchParams.get("mode");
    switch (mode) {
      case "email-otp":
        setFormState(SignInFormState.EmailOtp);
        break;
      case "email-password":
        setFormState(SignInFormState.EmailPassword);
        break;
      case "create-account":
        setFormState(SignInFormState.CreateAccount);
        break;
      case "reset-password":
        setFormState(SignInFormState.ResetPassword);
        break;
      default:
        setFormState(SignInFormState.EmailOtp);
    }
  }, [searchParams]);

  const updateURL = (newState: SignInFormState) => {
    let mode: string;
    switch (newState) {
      case SignInFormState.EmailOtp:
        mode = "email-otp";
        break;
      case SignInFormState.EmailPassword:
        mode = "email-password";
        break;
      case SignInFormState.CreateAccount:
        mode = "create-account";
        break;
      case SignInFormState.ResetPassword:
        mode = "reset-password";
        break;
      default:
        mode = "email-otp";
    }
    router.push(`/auth/sign-in?mode=${mode}`, { scroll: false });
  };

  const handleSetFormState = (newState: SignInFormState) => {
    setLoginError(null);
    setVerificationSent(false);
    setFormState(newState);
    updateURL(newState);
  };

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
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-lg p-6 space-y-8">
        <h1 className="font-bold text-2xl text-primary mb-2">
          {formState === SignInFormState.CreateAccount
            ? "Skapa konto på Entren"
            : formState === SignInFormState.ResetPassword
              ? "Glömt ditt lösenord?"
              : "Logga in"}
        </h1>
        {formState === SignInFormState.CreateAccount ? (
          <p className="text-sm text-muted-foreground mb-4">
            Har du redan ett konto?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => handleSetFormState(SignInFormState.EmailOtp)}
            >
              Logga in här
            </Button>
          </p>
        ) : (
          formState !== SignInFormState.ResetPassword && (
            <h3 className="font-semibold text-muted-foreground mb-4">
              Välkommen tillbaka! Logga in eller skapa ett nytt konto.
            </h3>
          )
        )}

        {formState === SignInFormState.ResetPassword && (
          <RequestResetPasswordForm
            onCancel={() => handleSetFormState(SignInFormState.EmailOtp)}
          />
        )}

        {formState === SignInFormState.EmailPassword && (
          <div className="space-y-2">
            <SignInForm
              onSubmit={handleSignIn}
              onResetPassword={() =>
                handleSetFormState(SignInFormState.ResetPassword)
              }
              loginError={loginError}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSetFormState(SignInFormState.CreateAccount)}
            >
              Skapa konto
            </Button>
          </div>
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
            <div className="relative my-12">
              <Separator className="w-full" />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-muted-foreground bg-white">
                eller
              </span>
            </div>

            <div className="space-y-3">
              <GoogleSignInButton />

              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={() =>
                  handleSetFormState(
                    formState === SignInFormState.EmailPassword
                      ? SignInFormState.EmailOtp
                      : SignInFormState.EmailPassword,
                  )
                }
              >
                {formState === SignInFormState.EmailPassword ? (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Logga in utan lösenord
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Logga in med lösenord
                  </>
                )}
              </Button>
            </div>

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
