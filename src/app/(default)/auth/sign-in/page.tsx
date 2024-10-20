import { Suspense } from "react";
import SignInPageContent from "@/src/components/auth/SignInPageContent";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInPageContent />
    </Suspense>
  );
}