"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { z } from "zod";
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
  handleAuth: (prevState: any, formData: FormData) => Promise<any>;
  checkEmailExists: (email: string) => Promise<boolean>;
  handleRequestResetPassword: (
    prevState: any,
    formData: FormData,
  ) => Promise<any>;
  handleResetPasswordAction: (
    prevState: any,
    formData: FormData,
  ) => Promise<any>; // Renamed prop
  initialFormState: string;
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

// Update the signUpSchema with Swedish error messages
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

const StatusMessage = ({
  message,
  success,
}: {
  message: string;
  success: boolean;
}) => (
  <div
    className={`mt-4 p-4 ${success ? "bg-green-50" : "bg-red-50"} rounded-md border ${success ? "border-green-200" : "border-red-200"} flex items-start`}
  >
    {success ? (
      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
    )}
    <p className={`text-sm ${success ? "text-green-700" : "text-red-700"}`}>
      {message}
    </p>
  </div>
);

export default function AuthFlowComponent({
  handleAuth,
  checkEmailExists,
  handleRequestResetPassword,
  handleResetPasswordAction, // Renamed prop
  initialFormState,
}: AuthFlowComponentProps) {
  const [formState, setFormState] = useState<AuthFormState>(
    initialFormState as AuthFormState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [validationErrors, setValidationErrors] = useState<
    Partial<SignUpFormData>
  >({});
  const [formData, setFormData] = useState<Partial<SignUpFormData>>({});
  const [initialEmail, setInitialEmail] = useState("");
  const [isEmailConfirmationStep, setIsEmailConfirmationStep] = useState(false);
  const [
    isRequestResetPasswordConfirmation,
    setIsRequestResetPasswordConfirmation,
  ] = useState(false);
  const [requestResetPasswordEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = React.useState(false);

  const [authState, authAction] = useFormState(handleAuth, {
    message: "",
    success: false,
  });
  const [requestResetState, requestResetAction] = useFormState(
    handleRequestResetPassword,
    { message: "", success: false },
  );
  const [resetState, resetAction] = useFormState(handleResetPasswordAction, {
    message: "",
    success: false,
  });

  useEffect(() => {
    const mode = searchParams.get("mode");
    switch (mode) {
      case "sign-up":
        setFormState(AuthFormState.SignUp);
        break;
      case "reset-password":
        setFormState(AuthFormState.ResetPassword);
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

  const validateField = useCallback(
    (name: keyof SignUpFormData, value: string) => {
      try {
        let fieldSchema;
        switch (name) {
          case "email":
            fieldSchema = z.string().email("Ogiltig e-postadress");
            break;
          case "firstName":
            fieldSchema = z
              .string()
              .min(2, "Förnamnet måste vara minst 2 tecken");
            break;
          case "lastName":
            fieldSchema = z
              .string()
              .min(2, "Efternamnet måste vara minst 2 tecken");
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
    },
    [],
  );

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

  const handleInitialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    if (validateEmail(email)) {
      try {
        const exists = await checkEmailExists(email);
        if (exists) {
          setEmailExists(true);
        } else {
          setInitialEmail(email);
          setFormState(AuthFormState.FullCreateAccount);
        }
      } catch (error) {
        setLoginError("Ett fel uppstod vid kontroll av e-postadressen");
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formState === AuthFormState.FullCreateAccount) {
      const formObject = Object.fromEntries(formData.entries());
      try {
        signUpSchema.parse(formObject);
        setValidationErrors({});
        setIsEmailConfirmationStep(true);
        setLoading(false);
        return;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.errors.reduce((acc, curr) => {
            acc[curr.path[0] as keyof SignUpFormData] = curr.message;
            return acc;
          }, {} as Partial<SignUpFormData>);
          setValidationErrors(errors);
          setLoading(false);
          return;
        }
      }
    }

    try {
      await authAction(formData);
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("An error occurred. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleRequestResetPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await requestResetAction(formData);
      setIsRequestResetPasswordConfirmation(true);
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Ett fel uppstod. Försök igen.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await resetAction(formData);
      router.push("/sign-in?mode=reset-success");
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError(
          "Ett fel uppstod vid återställning av lösenord. Försök igen.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignIn = () => {
    setFormState(AuthFormState.SignIn);
    setIsRequestResetPasswordConfirmation(false);
    router.push("/sign-in");
  };

  const renderForm = () => {
    if (isEmailConfirmationStep) {
      return <VerificationMessage email={initialEmail} />;
    }

    if (isRequestResetPasswordConfirmation) {
      return (
        <RequestResetPasswordConfirmation email={requestResetPasswordEmail} />
      );
    }

    switch (formState) {
      case AuthFormState.SignIn:
        return (
          <form action={authAction} className="space-y-4">
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
            {authState.message && (
              <>
                <StatusMessage
                  message={authState.message}
                  success={authState.success}
                />
                <p aria-live="polite" className="sr-only" role="status">
                  {authState.message}
                </p>
              </>
            )}
            <LoadingButton type="submit" className="w-full" loading={loading}>
              Logga in
            </LoadingButton>
            {renderGoogleButton("Logga in med Google")}
            {renderAdditionalOptions()}
          </form>
        );
      case AuthFormState.SignUp:
        return (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
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
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            {emailExists && (
              <div className="text-sm text-red-500">
                Detta konto finns redan. Vill du{" "}
                <button
                  type="button"
                  onClick={() => updateURL(AuthFormState.SignIn)}
                  className="text-primary font-semibold underline hover:text-primary-dark"
                >
                  logga in
                </button>{" "}
                istället?
              </div>
            )}
            <LoadingButton type="submit" className="w-full" loading={loading}>
              Fortsätt
            </LoadingButton>
            {renderGoogleButton("Registrera dig med Google")}
            {renderAdditionalOptions()}
            <div className="mt-4">
              <Separator className="my-4" />
              <p className="text-sm text-gray-500 text-center">
                Genom att fortsätta godkänner du Entréns
                <br />
                <a
                  className="font-bold underline text-primary hover:text-primary-dark"
                  target="_blank"
                  href="https://x.ai/legal/enterprise/terms-of-service"
                  rel="noopener noreferrer"
                >
                  Användarvillkor
                </a>{" "}
                och{" "}
                <a
                  className="underline font-bold text-primary hover:text-primary-dark"
                  target="_blank"
                  href="https://x.ai/privacy-policy"
                  rel="noopener noreferrer"
                >
                  Integritetspolicy
                </a>
                .
              </p>
            </div>
          </form>
        );
      case AuthFormState.CreateAccount:
      case AuthFormState.FullCreateAccount:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium">
                Förnamn
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName || ""}
                onChange={handleInputChange}
              />
              {validationErrors.firstName && (
                <p className="text-sm text-red-500">
                  {validationErrors.firstName}
                </p>
              )}
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
                value={formData.lastName || ""}
                onChange={handleInputChange}
              />
              {validationErrors.lastName && (
                <p className="text-sm text-red-500">
                  {validationErrors.lastName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                E-post
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={initialEmail}
                readOnly
              />
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
                  value={formData.password || ""}
                  onChange={handleInputChange}
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
              <ul className="text-sm text-gray-600 space-y-1 mt-2">
                <li
                  className={
                    formData.password && formData.password.length >= 8
                      ? "text-green-500"
                      : ""
                  }
                >
                  Minst 8 tecken
                </li>
                <li
                  className={
                    formData.password && /[A-Z]/.test(formData.password)
                      ? "text-green-500"
                      : ""
                  }
                >
                  Minst en stor bokstav
                </li>
                <li
                  className={
                    formData.password && /\d/.test(formData.password)
                      ? "text-green-500"
                      : ""
                  }
                >
                  Minst en siffra
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Bekräfta lösenord
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword || ""}
                  onChange={handleInputChange}
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
              {formData.password && formData.confirmPassword && (
                <p
                  className={`text-sm ${formData.password === formData.confirmPassword ? "text-green-500" : "text-red-500"}`}
                >
                  {formData.password === formData.confirmPassword
                    ? "Lösenorden matchar"
                    : "Lösenorden matchar inte"}
                </p>
              )}
            </div>
            <LoadingButton type="submit" className="w-full" loading={loading}>
              Skapa konto
            </LoadingButton>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setFormState(AuthFormState.SignUp)}
            >
              Gå tillbaka
            </Button>
          </form>
        );
      case AuthFormState.RequestResetPassword:
        return (
          <form action={requestResetAction} className="space-y-4">
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
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            <LoadingButton type="submit" className="w-full" loading={loading}>
              Begär återställning av lösenord
            </LoadingButton>
            {requestResetState.message && (
              <>
                <StatusMessage
                  message={requestResetState.message}
                  success={requestResetState.success}
                />
                <p aria-live="polite" className="sr-only" role="status">
                  {requestResetState.message}
                </p>
              </>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={navigateToSignIn}
            >
              Tillbaka till inloggning
            </Button>
          </form>
        );
      case AuthFormState.ResetPassword:
        return (
          <form action={resetAction} className="space-y-4">
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
                  onChange={handleInputChange}
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
              {/* Password criteria list */}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Bekräfta nytt lösenord
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword || ""}
                  onChange={handleInputChange}
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
              {/* Password match message */}
            </div>
            <LoadingButton type="submit" className="w-full" loading={loading}>
              Återställ lösenord
            </LoadingButton>
            {resetState.message && (
              <>
                <StatusMessage
                  message={resetState.message}
                  success={resetState.success}
                />
                <p aria-live="polite" className="sr-only" role="status">
                  {resetState.message}
                </p>
              </>
            )}
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
            Eller
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
          Har du inget konto?{" "}
          <button
            type="button"
            onClick={() => updateURL(AuthFormState.SignUp)}
            className="text-primary hover:underline"
          >
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
          <button
            type="button"
            onClick={() => updateURL(AuthFormState.SignIn)}
            className="text-primary hover:underline"
          >
            Logga in
          </button>
        </>
      )}
    </div>
  );

  const VerificationMessage = ({ email }: { email: string }) => (
    <div className="mt-6 p-6 bg-blue-50 rounded-md border border-blue-200">
      <div className="flex items-center mb-4">
        <Mail className="h-6 w-6 text-blue-500 mr-3" />
        <h4 className="font-semibold text-blue-700">Kontrollera din e-post</h4>
      </div>
      <p className="text-sm mb-4 text-gray-700">
        Vi har skickat en verifieringslänk till <strong>{email}</strong>. Klicka
        på länken i e-postmeddelandet för att verifiera ditt konto.
      </p>
      <p className="text-sm mb-4 text-gray-600">
        Om du inte hittar e-postmeddelandet, vänligen kontrollera din skräppost.
      </p>
    </div>
  );

  const RequestResetPasswordConfirmation = ({ email }: { email: string }) => (
    <div className="mt-6 p-6 bg-blue-50 rounded-md border border-blue-200">
      <div className="flex items-center mb-4">
        <Mail className="h-6 w-6 text-blue-500 mr-3" />
        <h4 className="font-semibold text-blue-700">Kontrollera din e-post</h4>
      </div>
      <p className="text-sm mb-4 text-gray-700">
        Vi har skickat instruktioner för att återställa ditt lösenord till{" "}
        <strong>{email}</strong>. Följ instruktionerna i e-postmeddelandet för
        att återställa ditt lösenord.
      </p>
      <p className="text-sm mb-4 text-gray-600">
        Om du inte hittar e-postmeddelandet, vänligen kontrollera din skräppost.
      </p>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={navigateToSignIn}
      >
        Tillbaka till inloggning
      </Button>
    </div>
  );

  const getHeaderContent = () => {
    if (isEmailConfirmationStep) {
      return {
        title: "Verifiera din e-post",
        subtitle: "Kontrollera din inkorg för att slutföra registreringen",
      };
    }

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
          subtitle:
            "Ange din e-postadress för att begära återställning av lösenord",
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
    <Card className="m-auto bg-card w-screen rounded-none shadow-none sm:rounded-lg sm:shadow-lg sm:shadow-zinc-500/10 sm:max-h-[calc(100vh-112px)] overflow-y-auto sm:max-w-md">
      <div>
        <AuthHeader {...getHeaderContent()} />
        <CardContent className="p-6">
          {!isEmailConfirmationStep &&
            !isRequestResetPasswordConfirmation &&
            formState !== AuthFormState.SignIn && (
              <button
                type="button"
                onClick={() => updateURL(AuthFormState.SignIn)}
                className="text-primary absolute top-6 left-6"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
          {renderForm()}
        </CardContent>
      </div>
    </Card>
  );
}
