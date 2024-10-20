import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function AuthConfirmPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();
  const token_hash = searchParams.token_hash as string;
  const type = searchParams.type as EmailOtpType;
  const next = (searchParams.next as string) ?? "/";

  if (token_hash && type) {
    const verifyOtpParams = type === 'signup' || type === 'magiclink'
      ? { type, token_hash }
      : { type, token_hash, email: searchParams.email as string };

    const { error } = await supabase.auth.verifyOtp(verifyOtpParams);

    if (!error) {
      redirect(next);
    } else {
      console.error("Error verifying email or magic link:", error);
      return <div>Unable to verify email or magic link. Please try again.</div>;
    }
  }

  return <div>Invalid or expired link.</div>;
}
