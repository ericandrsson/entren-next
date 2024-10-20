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
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EmailPasswordFormProps {
  onSubmit: (
    email: string,
    password: string,
    subscribeNewsletter: boolean,
    acceptTerms: boolean,
  ) => Promise<void>;
  onResetPassword: () => void;
  loginError: string | null;
  isCreatingAccount: boolean;
}

export default function EmailPasswordForm({
  onSubmit,
  onResetPassword,
  loginError,
  isCreatingAccount,
}: EmailPasswordFormProps) {
  const schema = z.object({
    email: z.string().email("Ogiltig e-postadress"),
    password: isCreatingAccount
      ? z.string().min(8, "Lösenordet måste vara minst 8 tecken långt")
      : z.string().min(1, "Lösenord krävs"),
    subscribeNewsletter: z.boolean().optional(),
    acceptTerms: isCreatingAccount
      ? z.boolean().refine((val) => val === true, {
          message: "Du måste godkänna användarvillkoren",
        })
      : z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      subscribeNewsletter: false,
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    onSubmit(
      values.email,
      values.password,
      values.subscribeNewsletter || false,
      values.acceptTerms || false,
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-postadress</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="bg-white" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lösenord</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  className="bg-white"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCreatingAccount && (
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
                      Få personanpassat innehåll och relevanta erbjudanden från
                      Entren och dess partners.
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
        {!isCreatingAccount && (
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm text-primary underline hover:no-underline"
              onClick={onResetPassword}
            >
              Glömt lösenordet?
            </Button>
          </div>
        )}
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground"
          disabled={!form.formState.isValid}
        >
          {isCreatingAccount ? "Skapa konto" : "Logga in"}
        </Button>

        {loginError && (
          <div className="flex items-center mt-3 p-3 bg-red-50 rounded-md border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-sm text-red-700">{loginError}</span>
          </div>
        )}
      </form>
    </Form>
  );
}
