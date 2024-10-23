"use client";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useActionState, useCallback, useEffect, useState } from "react";
import { z } from "zod";

import { checkEmailExists, handleLogin } from "@/src/app/(default)/(auth)/sign-in/page";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { Eye, EyeOff, Mail } from "lucide-react";
import Form from "next/form";
import { LoadingButton } from "../ui/loading-button";

enum AuthFormState {
  SignIn = "SIGN_IN",
  SignUp = "SIGN_UP",
  CreateAccount = "CREATE_ACCOUNT",
  RequestResetPassword = "REQUEST_RESET_PASSWORD",
  FullCreateAccount = "FULL_CREATE_ACCOUNT",
  ResetPassword = "RESET_PASSWORD",
}

interface AuthFlowComponentProps {
  handleRequestResetPassword: (prevState: any, formData: FormData) => Promise<any>;
  handleResetPasswordAction: (prevState: any, formData: FormData) => Promise<any>;
  handleSignUp: (prevState: any, formData: FormData) => Promise<any>;
  initialFormState: string;
}

const Logo = () => <Image src="/images/faster-forward-logo.png" alt="Faster Forward Logo" width={60} height={60} />;

const AuthHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <CardHeader className="relative flex flex-col items-center space-y-1.5 border-b border-secondary p-6 text-center">
    <div className="m-0 inline-flex items-center justify-center p-0">
      <Logo />
    </div>
    <h2 className="text-2xl font-semibold">{title}</h2>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </CardHeader>
);

const signUpSchema = z
  .object({
    email: z.string().email("Ogiltig e-postadress"),
    firstName: z.string().min(2, "Förnamnet måste vara minst 2 tecken"),
    lastName: z.string().min(2, "Efternamnet måste vara minst 2 tecken"),
    password: z
      .string()
      .min(8, "Lösenordet måste vara minst 8 tecken")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Lösenordet måste innehålla minst en stor bokstav, en liten bokstav och en siffra",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const StatusMessage = ({ message, success }: { message: string; success: boolean }) => (
  <div
    className={`mt-4 p-4 ${success ? "bg-green-50" : "bg-red-50"} rounded-md border ${success ? "border-green-200" : "border-red-200"} flex items-start`}
  >
    {success ? (
      <CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
    ) : (
      <AlertTriangle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
    )}
    <p className={`text-sm ${success ? "text-green-700" : "text-red-700"}`}>{message}</p>
  </div>
);

export default function AuthFlowComponent({
  handleRequestResetPassword,
  handleResetPasswordAction,
  handleSignUp,
  initialFormState,
}: AuthFlowComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encodedMessage = searchParams.get("message");
  const encodedConfirmationMessage = searchParams.get("confirmationMessage");
  const message = encodedMessage ? decodeURIComponent(encodedMessage) : null;
  const confirmationMessage = encodedConfirmationMessage ? decodeURIComponent(encodedConfirmationMessage) : null;

  const [formState, setFormState] = useState<AuthFormState>(initialFormState as AuthFormState);
  const [validationErrors, setValidationErrors] = useState<Partial<SignUpFormData>>({});
  const [formData, setFormData] = useState<Partial<SignUpFormData>>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [initialEmail, setInitialEmail] = useState("");
  const [isRequestResetPasswordConfirmation, setIsRequestResetPasswordConfirmation] = useState(false);
  const [requestResetPasswordEmail] = useState("");
  const [loginState, setLoginState] = useState({ message: "", success: false });

  const [requestResetState, requestResetAction, isRequestResetPending] = useActionState(handleRequestResetPassword, {
    message: "",
    success: false,
  });
  const [resetState, resetAction, isResetPending] = useActionState(handleResetPasswordAction, {
    message: "",
    success: false,
  });
  const [signUpState, signUpAction, isSignUpPending] = useActionState(handleSignUp, { message: "", success: false });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const mode = searchParams.get("mode");
    switch (mode) {
      case "sign-up":
        setFormState(AuthFormState.SignUp);
        break;
      case "reset-password":
        setFormState(AuthFormState.ResetPassword);
        // Initialize validation for reset password
        setValidationErrors({
          password: validatePassword("").join(", "),
          confirmPassword: "mismatch",
        });
        break;
      case "request-reset-password":
        setFormState(AuthFormState.RequestResetPassword);
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
      case AuthFormState.ResetPassword:
        mode = "reset-password";
        break;
      case AuthFormState.RequestResetPassword:
        mode = "request-reset-password";
        break;
      default:
        mode = "sign-in";
    }
    router.push(`/sign-in?mode=${mode}`);
  };

  const validateField = useCallback((name: keyof SignUpFormData, value: string) => {
    try {
      let fieldSchema;
      switch (name) {
        case "email":
          fieldSchema = z.string().email("Ogiltig e-postadress");
          break;
        case "firstName":
          fieldSchema = z.string().min(2, "Förnamnet måste vara minst 2 tecken");
          break;
        case "lastName":
          fieldSchema = z.string().min(2, "Efternamnet måste vara minst 2 tecken");
          break;
        case "password":
          fieldSchema = z
            .string()
            .min(8, "Lösenordet måste vara minst 8 tecken")
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              "Lösenordet måste innehålla minst en stor bokstav, en liten bokstav och en siffra",
            );
          break;
        case "confirmPassword":
          fieldSchema = z.string();
          break;
        default:
          return;
      }
      fieldSchema.parse(value);
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
        }));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof SignUpFormData, value);
  };

  const validateEmail = (email: string) => {
    try {
      z.string().email("Ogiltig e-postadress").parse(email);
      setValidationErrors((prev) => ({ ...prev, email: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors((prev) => ({
          ...prev,
          email: error.errors[0].message,
        }));
      }
      return false;
    }
  };

  const navigateToSignIn = () => {
    setFormState(AuthFormState.SignIn);
    setIsRequestResetPasswordConfirmation(false);
    router.push("/sign-in");
  };

  const handleEmailCheck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // Call the emailCheckAction and wait for the result
      const email_exists = await checkEmailExists(formData.get("email") as string);

      // After the action completes, check the updated email_exists
      if (email_exists.exists) {
        setValidationErrors((prev) => ({ ...prev, email: "Detta konto finns redan" }));
      } else {
        setInitialEmail(formData.get("email") as string);
        setFormState(AuthFormState.FullCreateAccount);
      }
    } catch (error) {
      console.error("Error during email check:", error);
      setValidationErrors((prev) => ({ ...prev, email: "Ett fel uppstod vid kontroll av e-postadressen" }));
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("length");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("uppercase");
    }
    if (!/\d/.test(password)) {
      errors.push("number");
    }
    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      const passwordErrors = validatePassword(value);
      setValidationErrors((prev) => ({
        ...prev,
        password: passwordErrors.join(", "),
        confirmPassword: value !== formData.confirmPassword ? "mismatch" : undefined,
      }));
    } else if (name === "confirmPassword") {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.password ? "mismatch" : undefined,
      }));
    }
  };

  const handleLoginCheck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const loggedIn = await handleLogin(formData.get("email") as string, formData.get("password") as string);
    if (loggedIn.success) {
      router.push("/");
    } else {
      setLoginState({ success: false, message: loggedIn.message });
    }
    setLoading(false);
  };

  const renderForm = () => {
    if (message) {
      return (
        <div className="space-y-4">
          <StatusMessage message={message} success={true} />
          <Button onClick={() => router.push("/sign-in")} className="w-full">
            Fortsätt till inloggning
          </Button>
        </div>
      );
    }

    if (confirmationMessage) {
      return (
        <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-6">
          <div className="mb-4 flex items-center">
            <Mail className="mr-3 h-6 w-6 text-blue-500" />

            <h4 className="font-semibold text-blue-700">Kontrollera din e-post</h4>
          </div>
          <p className="mb-4 text-sm text-gray-700">{confirmationMessage}</p>
          <Button onClick={() => router.push("/sign-in")} className="w-full">
            Fortsätt till inloggning
          </Button>
        </div>
      );
    }

    if (isRequestResetPasswordConfirmation) {
      return <RequestResetPasswordConfirmation email={requestResetPasswordEmail} />;
    }

    switch (formState) {
      case AuthFormState.SignIn:
        return (
          <Form action="" onSubmit={handleLoginCheck} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                E-post
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Lösenord
              </label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>
            {loginState.message && (
              <>
                <StatusMessage message={loginState.message} success={loginState.success} />
                <p aria-live="polite" className="sr-only" role="status">
                  {loginState.message}
                </p>
              </>
            )}
            <LoadingButton type="submit" className="w-full" loading={loading}>
              Logga in
            </LoadingButton>
            {renderGoogleButton("Logga in med Google")}
            {renderAdditionalOptions()}
          </Form>
        );
      case AuthFormState.SignUp:
        return (
          <Form action="" onSubmit={handleEmailCheck} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                E-post
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                onChange={(e) => validateEmail(e.target.value)}
                onBlur={(e) => validateEmail(e.target.value)}
              />
              {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
            </div>
            <LoadingButton type="submit" className="w-full" loading={loading}>
              Fortsätt
            </LoadingButton>
            {renderGoogleButton("Registrera dig med Google")}
            {renderAdditionalOptions()}
            <div className="mt-4">
              <Separator className="my-4" />
              <p className="text-center text-sm text-gray-500">
                Genom att fortsätta godkänner du Entréns
                <br />
                <a
                  className="hover:text-primary-dark font-bold text-primary underline"
                  target="_blank"
                  href="https://x.ai/legal/enterprise/terms-of-service"
                  rel="noopener noreferrer"
                >
                  Användarvillkor
                </a>{" "}
                och{" "}
                <a
                  className="hover:text-primary-dark font-bold text-primary underline"
                  target="_blank"
                  href="https://x.ai/privacy-policy"
                  rel="noopener noreferrer"
                >
                  Integritetspolicy
                </a>
                .
              </p>
            </div>
          </Form>
        );
      case AuthFormState.CreateAccount:
      case AuthFormState.FullCreateAccount:
        return (
          <Form action={signUpAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium">
                Förnamn
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {validationErrors.firstName && <p className="text-sm text-red-500">{validationErrors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium">
                Efternamn
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {validationErrors.lastName && <p className="text-sm text-red-500">{validationErrors.lastName}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                E-post
              </label>
              <Input id="email" name="email" type="email" required value={initialEmail} readOnly />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Lösenord
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li className={formData.password && formData.password.length >= 8 ? "text-green-500" : ""}>
                  Minst 8 tecken
                </li>
                <li className={formData.password && /[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                  Minst en stor bokstav
                </li>
                <li className={formData.password && /\d/.test(formData.password) ? "text-green-500" : ""}>
                  Minst en siffra
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Bekräfta lösenord
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              {formData.password && formData.confirmPassword && (
                <p
                  className={`text-sm ${formData.password === formData.confirmPassword ? "text-green-500" : "text-red-500"}`}
                >
                  {formData.password === formData.confirmPassword ? "Lösenorden matchar" : "Lösenorden matchar inte"}
                </p>
              )}
            </div>
            <LoadingButton type="submit" className="w-full" loading={isSignUpPending}>
              Skapa konto
            </LoadingButton>
            <Button type="button" variant="outline" className="w-full" onClick={() => setFormState(AuthFormState.SignUp)}>
              Gå tillbaka
            </Button>
          </Form>
        );
      case AuthFormState.RequestResetPassword:
        return (
          <Form action={requestResetAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                E-post
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                onChange={(e) => validateEmail(e.target.value)}
                onBlur={(e) => validateEmail(e.target.value)}
              />
              {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
            </div>
            <LoadingButton type="submit" className="w-full" loading={isRequestResetPending}>
              Begär återställning av lösenord
            </LoadingButton>
            {requestResetState.message && !requestResetState.success && (
              <StatusMessage message={requestResetState.message} success={false} />
            )}
            <Button type="button" variant="outline" className="w-full" onClick={navigateToSignIn}>
              Tillbaka till inloggning
            </Button>
          </Form>
        );
      case AuthFormState.ResetPassword:
        return (
          <>
            {resetState.success ? (
              <div className="space-y-4">
                <StatusMessage message={resetState.message} success={true} />
                <Button onClick={() => updateURL(AuthFormState.SignIn)} className="w-full">
                  Gå tillbaka till inloggning
                </Button>
              </div>
            ) : (
              <Form action={resetAction} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Nytt lösenord
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password || ""}
                      onChange={handlePasswordChange}
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
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li className={!validationErrors.password?.includes("length") ? "text-green-500" : "text-red-500"}>
                      Minst 8 tecken
                    </li>
                    <li className={!validationErrors.password?.includes("uppercase") ? "text-green-500" : "text-red-500"}>
                      Minst en stor bokstav
                    </li>
                    <li className={!validationErrors.password?.includes("number") ? "text-green-500" : "text-red-500"}>
                      Minst en siffra
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Bekräfta nytt lösenord
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword || ""}
                      onChange={handlePasswordChange}
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
                  {validationErrors.confirmPassword?.includes("mismatch") && (
                    <p className="text-sm text-red-500">Lösenorden matchar inte</p>
                  )}
                </div>
                <LoadingButton
                  type="submit"
                  className="w-full"
                  loading={isResetPending}
                  disabled={!!validationErrors.password?.length || !!validationErrors.confirmPassword?.length}
                >
                  Återställ lösenord
                </LoadingButton>
                {resetState.message && !resetState.success && <StatusMessage message={resetState.message} success={false} />}
              </Form>
            )}
          </>
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
          <span className="bg-background px-2 text-muted-foreground">Eller</span>
        </div>
      </div>
      <Button variant="outline" className="mt-4 w-full">
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
          Har du inget konto?{" "}
          <button type="button" onClick={() => updateURL(AuthFormState.SignUp)} className="text-primary hover:underline">
            Registrera dig
          </button>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => updateURL(AuthFormState.RequestResetPassword)}
              className="text-primary hover:underline"
            >
              Glömt ditt lösenord?
            </button>
          </div>
        </>
      ) : (
        <>
          Har du redan ett konto?{" "}
          <button type="button" onClick={() => updateURL(AuthFormState.SignIn)} className="text-primary hover:underline">
            Logga in
          </button>
        </>
      )}
    </div>
  );

  const VerificationMessage = ({ email }: { email: string }) => (
    <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-6">
      <div className="mb-4 flex items-center">
        <Mail className="mr-3 h-6 w-6 text-blue-500" />
        <h4 className="font-semibold text-blue-700">Kontrollera din e-post</h4>
      </div>
      <p className="mb-4 text-sm text-gray-700">
        Vi har skickat en verifieringslänk till <strong>{email}</strong>. Klicka på länken i e-postmeddelandet för att
        verifiera ditt konto.
      </p>
      <p className="mb-4 text-sm text-gray-600">Om du inte hittar e-postmeddelandet, vänligen kontrollera din skräppost.</p>
    </div>
  );

  const RequestResetPasswordConfirmation = ({ email }: { email: string }) => (
    <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-6">
      <div className="mb-4 flex items-center">
        <Mail className="mr-3 h-6 w-6 text-blue-500" />
        <h4 className="font-semibold text-blue-700">Kontrollera din e-post</h4>
      </div>
      <p className="mb-4 text-sm text-gray-700">
        Vi har skickat instruktioner för att återställa ditt lösenord till <strong>{email}</strong>. Följ instruktionerna i
        e-postmeddelandet för att återställa ditt lösenord.
      </p>
      <p className="mb-4 text-sm text-gray-600">Om du inte hittar e-postmeddelandet, vänligen kontrollera din skräppost.</p>
      <Button type="button" variant="outline" className="w-full" onClick={navigateToSignIn}>
        Tillbaka till inloggning
      </Button>
    </div>
  );

  const getHeaderContent = () => {
    if (isRequestResetPasswordConfirmation) {
      return {
        title: "Begäran om återställning av lösenord",
        subtitle: "Kontrollera din inkorg för instruktioner",
      };
    }

    switch (formState) {
      case AuthFormState.SignIn:
        return { title: "Logga in", subtitle: "Logga in med ditt Entré-konto" };
      case AuthFormState.SignUp:
        return { title: "Skapa konto", subtitle: "Skapa ditt Entré-konto" };
      case AuthFormState.CreateAccount:
      case AuthFormState.FullCreateAccount:
        return {
          title: "Skapa konto",
          subtitle: "Fyll i din kontoinformation",
        };
      case AuthFormState.RequestResetPassword:
        return {
          title: "Begär återställning av lösenord",
          subtitle: "Ange din e-postadress för att begära återställning av lösenord",
        };
      case AuthFormState.ResetPassword:
        return {
          title: "Återställ lösenord",
          subtitle: "Ange ditt nya lösenord",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  return (
    <Card className="m-auto w-screen overflow-y-auto rounded-none bg-card shadow-none sm:max-h-[calc(100vh-112px)] sm:max-w-md sm:rounded-lg sm:shadow-lg sm:shadow-zinc-500/10">
      <div>
        <AuthHeader {...getHeaderContent()} />
        <CardContent className="p-6">{renderForm()}</CardContent>
      </div>
    </Card>
  );
}
