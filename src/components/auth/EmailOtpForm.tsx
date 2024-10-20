"use client";

import { SignInFormState } from "@/src/app/(default)/auth/sign-in/page";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { LoginFormValues } from "@/src/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EmailOtpFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  formState: SignInFormState;
  loginError: string | null;
  verificationSent: boolean;
}

const createAccountSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken långt"),
  subscribeNewsletter: z.boolean(),
  acceptTerms: z.boolean(),
});

const otpSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
});

export default function EmailOtpForm({
  onSubmit,
  formState,
  loginError,
  verificationSent,
}: EmailOtpFormProps) {
  const isCreateAccount = formState === SignInFormState.CreateAccount;

  const form = useForm<z.infer<typeof createAccountSchema> | z.infer<typeof otpSchema>>({
    resolver: zodResolver(isCreateAccount ? createAccountSchema : otpSchema),
    defaultValues: isCreateAccount
      ? {
          email: "",
          password: "",
          subscribeNewsletter: false,
          acceptTerms: false,
        }
      : { email: "" },
    mode: "onChange",
  });

  const handleSubmit = (values: z.infer<typeof createAccountSchema> | z.infer<typeof otpSchema>) => {
    onSubmit(values as LoginFormValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-postadress</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCreateAccount && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lösenord</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isCreateAccount && (
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
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground"
          disabled={!form.formState.isValid}
        >
          {isCreateAccount ? "Skapa konto" : "Skicka inloggningslänk"}
        </Button>

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
              <h4 className="font-semibold text-blue-700">Kolla din e-post</h4>
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
  );
}
