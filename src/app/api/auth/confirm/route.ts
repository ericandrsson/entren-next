import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  console.log("token_hash ", token_hash);
  console.log("type ", type);
  console.log("next ", next);

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (type === "recovery") {
        const response = NextResponse.redirect(next);
        response.cookies.set({
          name: "auth",
          value: "ALLOWED_TO_RESET_PASSWORD",
          httpOnly: true,
          path: "/",
        });
        console.log("response ", response);
        return response;
      }
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  console.log("error ", error);

  // redirect the user to an error page with some instructions
  redirect("/error");
}
