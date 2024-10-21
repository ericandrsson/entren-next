"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
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
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => updateURL(AuthFormState.ResetPassword)}
                className="text-primary hover:underline"
              >
                Forgot your password?
              </button>
            </div>
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
          </form>
        );
    }
  };

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

  const Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ height: "60px", width: "60px" }}
    >
      <path d="m3.005 8.858 8.783 12.544h3.904L6.908 8.858zM6.905 15.825 3 21.402h3.907l1.951-2.788zM16.585 2l-6.75 9.64 1.953 2.79L20.492 2zM17.292 7.965v13.437h3.2V3.395z"></path>
    </svg>
  );

  return (
    <div className="w-full max-w-md mx-auto md:mt-8">
      <Card className="md:shadow-md shadow-none rounded-none md:rounded-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            {formState !== AuthFormState.SignIn && (
              <button
                type="button"
                onClick={() => updateURL(AuthFormState.SignIn)}
                className="text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <Logo />
            {formState !== AuthFormState.SignIn && <div className="w-4" />}
          </div>
          <h2 className="text-2xl font-semibold">
            {formState === AuthFormState.SignIn && "Sign In"}
            {formState === AuthFormState.SignUp && "Sign Up"}
            {formState === AuthFormState.CreateAccount && "Create Account"}
            {formState === AuthFormState.ResetPassword && "Reset Password"}
            {formState === AuthFormState.FullCreateAccount && "Create Account"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {formState === AuthFormState.SignIn &&
              "Continue with your xAI account"}
            {formState === AuthFormState.SignUp && "Create an xAI account"}
            {formState === AuthFormState.CreateAccount &&
              "Complete your account information"}
            {formState === AuthFormState.ResetPassword &&
              "Enter your email to reset your password"}
            {formState === AuthFormState.FullCreateAccount &&
              "Complete your account information"}
          </p>
        </CardHeader>
        <CardContent>
          {renderForm()}
          {loginError && <ErrorMessage message={loginError} />}
          {verificationSent && <VerificationMessage email="user@example.com" />}
          {formState === AuthFormState.SignIn && (
            <>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full">
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
                  Sign in with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => updateURL(AuthFormState.SignUp)}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </div>
            </>
          )}
          {formState === AuthFormState.SignUp && (
            <>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Sign up with X
                </Button>
                <Button variant="outline" className="w-full">
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
                  Sign up with Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23">
                    <path
                      d="M21.05 17.53a11.28 11.28 0 0 1-1.63 2.72 10.82 10.82 0 0 1-2.32 2.12c-.92.64-1.89 1.05-2.9 1.23-.99.19-2.06.18-3.21-.01-1.15-.2-2.24-.59-3.27-1.18-1.03-.59-1.96-1.32-2.79-2.18A11.07 11.07 0 0 1 2.5 16.5a11.17 11.17 0 0 1-.97-3.43c-.14-1.17-.11-2.32.09-3.46.2-1.14.58-2.24 1.13-3.28.55-1.04 1.27-1.96 2.15-2.76.88-.8 1.9-1.43 3.05-1.89 1.15-.45 2.39-.68 3.71-.68 1.32 0 2.56.23 3.71.68 1.15.46 2.17 1.09 3.05 1.89.88.8 1.6 1.72 2.15 2.76.55 1.04.93 2.14 1.13 3.28.2 1.14.23 2.29.09 3.46-.14 1.17-.45 2.32-.93 3.46zm-4.23-2.19c.05-.17.09-.38.12-.62.03-.24.05-.49.05-.74 0-.25-.02-.5-.05-.74-.03-.24-.07-.45-.12-.62l-3.79-1.59c-.05.2-.09.42-.11.66-.02.24-.04.5-.04.78v3.13c0 .27.01.53.04.77.02.24.06.46.11.66l3.79-1.69zm-9.64 0 3.79 1.69c.05-.2.09-.42.11-.66.02-.24.03-.5.03-.77v-3.13c0-.28-.01-.54-.03-.78-.02-.24-.06-.46-.11-.66l-3.79 1.59c-.05.17-.09.38-.12.62-.03.24-.05.49-.05.74 0 .25.02.5.05.74.03.24.07.45.12.62zm9.64-7.67c-.05-.17-.09-.38-.12-.62-.03-.24-.05-.49-.05-.74 0-.25.02-.5.05-.74.03-.24.07-.45.12-.62l-3.79-1.59c-.05.2-.09.42-.11.66-.02.24-.04.5-.04.78v3.13c0 .27.01.53.04.77.02.24.06.46.11.66l3.79-1.69zm-9.64 0 3.79 1.69c.05-.2.09-.42.11-.66.02-.24.03-.5.03-.77V4.8c0-.28-.01-.54-.03-.78-.02-.24-.06-.46-.11-.66l-3.79 1.59c-.05.17-.09.38-.12.62-.03.24-.05.49-.05.74 0 .25.02.5.05.74.03.24.07.45.12.62z"
                      fill="#00A4EF"
                    />
                  </svg>
                  Sign up with Microsoft
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => updateURL(AuthFormState.SignIn)}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
