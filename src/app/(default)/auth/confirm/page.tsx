import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function Confirm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token_hash = searchParams.token_hash as string | undefined;
  const type = searchParams.type as EmailOtpType | undefined;
  const next = (searchParams.next as string) ?? "/";

  if (token_hash && type) {
    console.log("token_hash", token_hash);
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      const { data: user } = await supabase.auth.getUser();
      console.log("user", user);
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
