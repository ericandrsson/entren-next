"use client";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
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

const signInSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onResetPassword: () => void;
  loginError: string | null;
}

export function SignInForm({
  onSubmit,
  onResetPassword,
  loginError,
}: SignInFormProps) {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleSubmit = (values: z.infer<typeof signInSchema>) => {
    onSubmit(values.email, values.password);
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
              <div className="flex justify-between items-center">
                <FormLabel>Lösenord</FormLabel>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-xs text-primary underline"
                  onClick={onResetPassword}
                >
                  Glömt lösenordet?
                </Button>
              </div>
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
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={!form.formState.isValid}
          >
            Logga in
          </Button>
        </div>

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
