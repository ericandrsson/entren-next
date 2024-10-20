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
import { AlertTriangle, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken långt"),
  subscribeNewsletter: z.boolean(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Du måste godkänna användarvillkoren",
  }),
});

interface SignUpFormProps {
  onSubmit: (email: string, password: string, subscribeNewsletter: boolean, acceptTerms: boolean) => Promise<void>;
  loginError: string | null;
  verificationSent: boolean;
}

export function SignUpForm({ onSubmit, loginError, verificationSent }: SignUpFormProps) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      subscribeNewsletter: false,
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const handleSubmit = (values: z.infer<typeof signUpSchema>) => {
    onSubmit(values.email, values.password, values.subscribeNewsletter, values.acceptTerms);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {loginError && loginError.includes("redan registrerad") && (
          <div className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50" role="alert">
            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Obs!</span> {loginError}
            </div>
          </div>
        )}
        
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
                <Input {...field} type="password" className="bg-white" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground"
          disabled={!form.formState.isValid}
        >
          Skapa konto
        </Button>

        {loginError && !loginError.includes("redan registrerad") && (
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
              Vi har skickat en verifieringslänk till{" "}
              <strong>{form.getValues().email}</strong>. Klicka på länken i
              e-postmeddelandet för att verifiera ditt konto.
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
