"use client";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useToast } from "@/src/hooks/use-toast";
import { loginFormSchema, LoginFormValues } from "@/src/lib/schemas/auth";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, HelpCircle, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface LoginFormProps {
  onResetPassword: (email?: string) => void;
}

export default function SignInForm({ onResetPassword }: LoginFormProps) {
  const [formState, setFormState] = useState<"initial" | "password" | "create">(
    "initial",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const startCooldown = useCallback(() => {
    setCooldown(30); // 30 seconds cooldown
  }, []);

  const supabase = createClient();

  // Initialize the form with the new schema
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      subscribeNewsletter: false,
      acceptTerms: false,
    },
    mode: "onChange", // Enable real-time validation
  });

  // Check if email exists
  const checkEmailExists = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc("check_email_exists", {
        email,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // Add this new function to reset the form state
  const resetFormState = useCallback(() => {
    setVerificationSent(false);
    setLoginError(null);
    setEmailExists(false);
    setCooldown(0);
  }, []);

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    console.log("onSubmit called with values:", values);
    console.log("Current formState:", formState);
    console.log("showPassword:", showPassword);

    resetFormState(); // Reset the form state before submitting

    if (formState === "create") {
      console.log("Calling handleSignUp");
      await handleSignUp(values);
    } else if (showPassword) {
      console.log("Calling handlePasswordLogin");
      await handlePasswordLogin(values);
    } else {
      console.log("Calling handleOtpLogin");
      await handleOtpLogin(values);
    }
  };

  // Handle sign up
  const handleSignUp = async (values: LoginFormValues) => {
    if (cooldown > 0) {
      toast({
        title: "Vänta lite",
        description: `Försök igen om ${cooldown} sekunder.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    const exists = await checkEmailExists(values.email);
    if (exists) {
      setEmailExists(true);
      setIsLoading(false);
      return;
    }

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
      console.log(error);
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
      setVerificationSent(true);
      startCooldown();
    }
    setIsLoading(false);
  };

  // Handle password login
  const handlePasswordLogin = async (values: LoginFormValues) => {
    setLoginError(null); // Reset error state before attempting login
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password as string,
    });
    if (error) {
      console.error("Error logging in:", error);
      setLoginError("Felaktigt användarnamn eller lösenord");
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

  // Handle OTP login
  const handleOtpLogin = async (values: LoginFormValues) => {
    console.log("handleOtpLogin called with email:", values.email);
    setIsLoading(true);
    setLoginError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          shouldCreateUser: true,
        },
      });

      console.log("OTP sign-in result:", error ? "Error" : "Success");

      if (error) throw error;

      setVerificationSent(true);
      toast({
        title: "Inloggningslänk skickad",
        description: "Kolla din e-post för en länk att logga in med.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      setLoginError(
        "Det gick inte att skicka inloggningslänken. Försök igen senare.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password login
  const togglePasswordLogin = () => {
    resetFormState();
    setShowPassword(!showPassword);
    setFormState(showPassword ? "initial" : "password");
  };

  // Update the "Glömt lösenordet?" button click handler
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = form.getValues("email");
    onResetPassword(email); // Pass the email to the onResetPassword function
  };

  // Update the handleLoginInstead function
  const handleLoginInstead = (e: React.MouseEvent) => {
    e.preventDefault();
    resetFormState();
    setShowPassword(true);
    setFormState("password");
    // Reset the password field
    form.setValue("password", "");
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6">
      {formState === "create" ? (
        <>
          <h1 className="font-bold text-2xl text-primary">
            Skapa konto på Entren
          </h1>
          <p className="text-sm text-muted-foreground">
            Har du redan ett konto?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => {
                resetFormState();
                setFormState("initial");
              }}
            >
              Logga in här
            </Button>
          </p>
        </>
      ) : (
        <>
          <h1 className="font-bold text-2xl text-primary">Logga in</h1>
          <h3 className="font-semibold text-muted-foreground">
            Välkommen tillbaka! Logga in eller skapa ett nytt konto.
          </h3>
        </>
      )}
      {!showPassword && formState !== "create" && (
        <p className="text-sm text-muted-foreground">
          Logga in eller skapa konto utan lösenord - fyll i din e-postadress så
          skickar vi en länk.
        </p>
      )}
      <Form {...form}>
        <form className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    E-postadress
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Redan registrerad? Logga in istället.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className={`bg-white ${emailExists ? "border-red-500" : ""}`}
                      onChange={(e) => {
                        field.onChange(e);
                        if (emailExists) {
                          setEmailExists(false);
                        }
                      }}
                    />
                  </FormControl>
                  {showPassword && (
                    <div className="text-right mt-1">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-primary underline hover:no-underline"
                        onClick={handleForgotPassword}
                      >
                        Glömt lösenordet?
                      </Button>
                    </div>
                  )}
                  {emailExists && (
                    <div className="flex items-start mt-3 p-3 bg-red-50 rounded-md border border-red-200">
                      <div className="text-sm text-red-700">
                        <p className="mb-2">
                          Den här e-postadressen är redan registrerad.
                        </p>
                        <p>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-red-700 font-semibold hover:underline"
                            onClick={handleLoginInstead}
                          >
                            Logga in istället
                          </Button>{" "}
                          eller{" "}
                          <Button
                            variant="link"
                            className="p-0 h-auto text-red-700 font-semibold hover:underline"
                            onClick={handleForgotPassword}
                          >
                            återställ lösenordet
                          </Button>{" "}
                          om du behöver hjälp.
                        </p>
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {(showPassword || formState === "create") && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {formState === "create" ? "Välj lösenord" : "Lösenord"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {formState === "create" && (
            <>
              <FormField
                control={form.control}
                name="subscribeNewsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Ja tack! Jag vill prenumerera på Entrens nyhetsbrev
                      </FormLabel>
                      <FormDescription>
                        Få personanpassat innehåll och relevanta erbjudanden
                        från Entren och dess partners, i enlighet med Entrens
                        personuppgiftspolicy.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        required
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Jag godkänner användarvillkor för Entrenkonto
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}

          {!verificationSent && (
            <Button
              type="button"
              className="w-full bg-primary text-primary-foreground"
              disabled={isLoading}
              onClick={() => {
                console.log("Button clicked");
                const values = form.getValues();
                onSubmit(values);
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {formState === "create"
                    ? "Skapar konto..."
                    : "Skickar inloggningslänk..."}
                </>
              ) : formState === "create" ? (
                "Skapa konto"
              ) : showPassword ? (
                "Logga in"
              ) : (
                "Skicka inloggningslänk"
              )}
            </Button>
          )}

          {loginError && (
            <div className="flex items-center mt-3 p-3 bg-red-50 rounded-md border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-sm text-red-700">{loginError}</span>
            </div>
          )}

          {verificationSent && (
            <div className="mt-6 p-6 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-blue-500 mr-3" />
                <h4 className="font-semibold text-blue-700">
                  Kolla din e-post
                </h4>
              </div>
              <p className="text-sm mb-4 text-gray-700">
                Vi har skickat en inloggningslänk till{" "}
                <strong>{form.getValues().email}</strong>. Klicka på länken i
                e-postmeddelandet för att logga in.
              </p>
              <p className="text-sm mb-4 text-gray-600">
                Om du inte hittar mejlet, kolla din skräppost.
              </p>
            </div>
          )}
        </form>
      </Form>
      <p className="text-xs text-muted-foreground mt-4">
        Genom att använda tjänsten godkänner du{" "}
        <a href="#" className="text-primary hover:underline">
          användarvillkor för EntrenKonto
        </a>
      </p>
      <div className="relative my-6">
        <Separator className="w-full" />
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-muted-foreground bg-white">
          eller
        </span>
      </div>
      <Button
        variant="outline"
        className="bg-white text-gray-400 w-full flex items-center justify-center space-x-2"
        onClick={() => {
          // TODO: Implement Google sign-in
          console.log("Sign in with Google");
        }}
      >
        <img
          src="/images/google-icon.svg"
          alt="Google icon"
          className="h-4 w-4"
        />
        <span>Fortsätt med Google</span>
      </Button>
      <Button
        variant="outline"
        className="bg-white text-primary w-full mt-3 flex items-center justify-center shadow-lg"
        onClick={togglePasswordLogin}
      >
        <Lock className="h-4 w-4 mr-2" />
        {showPassword ? "Logga in utan lösenord" : "Logga in med lösenord"}
      </Button>
      {formState !== "create" && (
        <Button
          variant="link"
          className="w-full mt-3"
          onClick={() => {
            resetFormState();
            setFormState("create");
          }}
        >
          Skapa konto
        </Button>
      )}
      {formState === "create" && (
        <Button
          variant="link"
          className="w-full mt-3"
          onClick={() => {
            resetFormState();
            setFormState("initial");
            setShowPassword(false);
          }}
        >
          Jag har redan ett konto
        </Button>
      )}
      <p className="text-xs text-center text-muted-foreground mt-6">
        Så hanterar vi dina{" "}
        <a href="#" className="text-primary hover:underline">
          personuppgifter
        </a>
      </p>
    </div>
  );
}
