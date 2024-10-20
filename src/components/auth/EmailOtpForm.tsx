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
import { loginFormSchema, LoginFormValues } from "@/src/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EmailOtpFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  formState: SignInFormState;
}

export default function EmailOtpForm({
  onSubmit,
  formState,
}: EmailOtpFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      subscribeNewsletter: false,
      acceptTerms: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        {formState === SignInFormState.CreateAccount && (
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
        >
          {formState === SignInFormState.CreateAccount
            ? "Skapa konto"
            : "Skicka inloggningslänk"}
        </Button>
      </form>
    </Form>
  );
}
