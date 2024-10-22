import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (type === "recovery") {
        const response = NextResponse.redirect(`${next}/sign-in?mode=reset-password`);
        response.cookies.set({
          name: "auth",
          value: "ALLOWED_TO_RESET_PASSWORD",
          httpOnly: true,
          path: "/",
          maxAge: 60 * 10, // 10 minutes
        });
        return response;
      }
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(next);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${next}/auth/auth-code-error`);
}
