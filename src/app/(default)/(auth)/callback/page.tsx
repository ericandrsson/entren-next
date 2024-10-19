"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error during auth callback:", error);
        localStorage.setItem("authToast", JSON.stringify({
          title: "Authentication Error",
          description: "Unable to authenticate. Please try again.",
          variant: "destructive",
        }));
        router.push("/login");
        return;
      }

      if (data?.session) {
        localStorage.setItem("authToast", JSON.stringify({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        }));
        router.push("/dashboard");
      } else {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const type = params.get("type");

        if (token && type === "signup") {
          const { data, error } = await supabase.auth.verifyOtp({
            token,
            type: "signup",
          });
          if (error) {
            console.error("Error verifying email:", error);
            localStorage.setItem("authToast", JSON.stringify({
              title: "Verification Error",
              description: "Unable to verify email. Please try again.",
              variant: "destructive",
            }));
            router.push("/login");
          } else if (data.session) {
            localStorage.setItem("authToast", JSON.stringify({
              title: "Account Verified",
              description: "Your email has been verified and you're now logged in.",
            }));
            router.push("/dashboard");
          } else {
            localStorage.setItem("authToast", JSON.stringify({
              title: "Email Verified",
              description: "Your email has been verified. Please log in.",
            }));
            router.push("/login");
          }
        } else {
          localStorage.setItem("authToast", JSON.stringify({
            title: "Invalid Callback",
            description: "This link is invalid or has expired.",
            variant: "destructive",
          }));
          router.push("/login");
        }
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return <p>Processing authentication, please wait...</p>;
}
