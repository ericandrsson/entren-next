import { Button } from "@/src/components/ui/button";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    console.log("Sign in with Google");
  };

  return (
    <Button
      variant="outline"
      className="bg-white text-gray-400 w-full flex items-center justify-center space-x-2"
      onClick={handleGoogleSignIn}
    >
      <img
        src="/images/google-icon.svg"
        alt="Google icon"
        className="h-4 w-4"
      />
      <span>Fortsätt med Google</span>
    </Button>
  );
}
