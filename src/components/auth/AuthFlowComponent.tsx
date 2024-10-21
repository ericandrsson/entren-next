"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

enum AuthFormState {
  SignIn = "SIGN_IN",
  SignUp = "SIGN_UP",
  CreateAccount = "CREATE_ACCOUNT",
  ResetPassword = "RESET_PASSWORD",
  FullCreateAccount = "FULL_CREATE_ACCOUNT",
}

interface AuthFlowComponentProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

const Logo = () => (
  <Image
    src="/images/faster-forward-logo.png"
    alt="Faster Forward Logo"
    width={60}
    height={60}
  />
);

// Add this new component at the top of the file, after the imports
const AuthHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <CardHeader className="space-y-1.5 p-6 relative border-b flex flex-col border-secondary text-center items-center">
    <div className="inline-flex items-center justify-center p-0 m-0">
      <Logo />
    </div>
    <h2 className="text-2xl font-semibold">{title}</h2>
    <p className="text-muted-foreground text-sm">{subtitle}</p>
  </CardHeader>
);

export default function AuthFlowComponent({
  onSubmit,
}: AuthFlowComponentProps) {
  const [formState, setFormState] = useState<AuthFormState>(
    AuthFormState.SignIn,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    switch (mode) {
      case "sign-up":
        setFormState(AuthFormState.SignUp);
        break;
      case "create-account":
        setFormState(AuthFormState.CreateAccount);
        break;
      case "reset-password":
        setFormState(AuthFormState.ResetPassword);
        break;
      default:
        setFormState(AuthFormState.SignIn);
    }
  }, [searchParams]);

  const updateURL = (newState: AuthFormState) => {
    let mode: string;
    switch (newState) {
      case AuthFormState.SignUp:
        mode = "sign-up";
        break;
      case AuthFormState.CreateAccount:
        mode = "create-account";
        break;
      case AuthFormState.ResetPassword:
        mode = "reset-password";
        break;
      default:
        mode = "sign-in";
    }
    router.push(`/auth/sign-in?mode=${mode}`, { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await onSubmit(formData);
      setLoginError(null);
      if (formState === AuthFormState.FullCreateAccount) {
        setVerificationSent(true);
      }
    } catch (error) {
      setLoginError("An error occurred. Please try again.");
    }
  };

  const renderForm = () => {
    switch (formState) {
      case AuthFormState.SignIn:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {renderGoogleButton("Sign in with Google")}
            {renderAdditionalOptions()}
          </form>
        );
      case AuthFormState.SignUp:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
            {renderGoogleButton("Sign up with Google")}
            {renderAdditionalOptions()}
          </form>
        );
      case AuthFormState.CreateAccount:
      case AuthFormState.FullCreateAccount:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium">
                First name
              </label>
              <Input id="firstName" name="firstName" type="text" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last name
              </label>
              <Input id="lastName" name="lastName" type="text" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        );
      case AuthFormState.ResetPassword:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => updateURL(AuthFormState.SignIn)}
            >
              Return to sign-in
            </Button>
          </form>
        );
    }
  };

  const renderGoogleButton = (text: string) => (
    <div className="mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full mt-4">
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        {text}
      </Button>
    </div>
  );

  const renderAdditionalOptions = () => (
    <div className="mt-4 text-center text-sm">
      {formState === AuthFormState.SignIn ? (
        <>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => updateURL(AuthFormState.SignUp)}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => updateURL(AuthFormState.ResetPassword)}
              className="text-primary hover:underline"
            >
              Forgot your password?
            </button>
          </div>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => updateURL(AuthFormState.SignIn)}
            className="text-primary hover:underline"
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center mt-3 p-3 bg-red-50 rounded-md border border-red-200">
      <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
      <span className="text-sm text-red-700">{message}</span>
    </div>
  );

  const VerificationMessage = ({ email }: { email: string }) => (
    <div className="mt-6 p-6 bg-blue-50 rounded-md border border-blue-200">
      <div className="flex items-center mb-4">
        <Mail className="h-6 w-6 text-blue-500 mr-3" />
        <h4 className="font-semibold text-blue-700">Check your email</h4>
      </div>
      <p className="text-sm mb-4 text-gray-700">
        We've sent a verification link to <strong>{email}</strong>. Click the
        link in the email to verify your account.
      </p>
      <p className="text-sm mb-4 text-gray-600">
        If you can't find the email, please check your spam folder.
      </p>
    </div>
  );

  const getHeaderContent = () => {
    switch (formState) {
      case AuthFormState.SignIn:
        return { title: "Sign In", subtitle: "Continue with your xAI account" };
      case AuthFormState.SignUp:
        return { title: "Sign Up", subtitle: "Create an xAI account" };
      case AuthFormState.CreateAccount:
      case AuthFormState.FullCreateAccount:
        return {
          title: "Create Account",
          subtitle: "Complete your account information",
        };
      case AuthFormState.ResetPassword:
        return {
          title: "Reset Password",
          subtitle: "Enter your email to reset your password",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  return (
    <Card className="m-auto sm:h-auto bg-card w-screen sm:rounded-lg sm:shadow-lg sm:shadow-zinc-500/10 sm:max-h-[calc(100vh-112px)] overflow-y-auto sm:max-w-md">
      <div>
        <AuthHeader {...getHeaderContent()} />
        <CardContent className="p-6">
          {formState !== AuthFormState.SignIn && (
            <button
              type="button"
              onClick={() => updateURL(AuthFormState.SignIn)}
              className="text-primary absolute top-6 left-6"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {renderForm()}
          {loginError && <ErrorMessage message={loginError} />}
          {verificationSent && <VerificationMessage email="user@example.com" />}
        </CardContent>
      </div>
    </Card>
  );
}
