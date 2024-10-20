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
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }),
});

interface ResetPasswordFormProps {
  onCancel: () => void;
  initialEmail?: string;
}

export function RequestResetPasswordForm({
  onCancel,
  initialEmail = "",
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      );
      if (error) throw error;
      setResetSent(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      // You might want to show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Det händer de flesta någon gång. Skicka oss din e-postadress som du
        använder för att logga in på Entren. Då skickar vi instruktioner till
        dig för hur du skapar ett nytt lösenord.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-postadress</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="bg-white"
                    disabled={!!initialEmail}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={isLoading || resetSent}
          >
            {isLoading ? "Skickar..." : "Återställ lösenord"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            Gå tillbaka
          </Button>
        </form>
      </Form>
      {resetSent && (
        <div className="mt-6 p-6 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-blue-500 mr-3" />
            <h4 className="font-semibold text-blue-700">Tack!</h4>
          </div>
          <p className="text-sm mb-2 text-gray-700">
            Vi har skickat e-post till dig med instruktioner för hur du skapar
            ett nytt lösenord.
          </p>
          <p className="text-sm text-gray-700">
            Kolla inkorgen i din e-postbrevlåda.
          </p>
        </div>
      )}
    </>
  );
}
