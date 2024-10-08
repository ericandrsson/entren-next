import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default function Header() {
  const supabase = createClient();
  const { data, error } = supabase.auth.getUser()
  console.log(data, error);
  return (
    <header className="w-full bg-background shadow-sm">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Entren
        </Link>
        <Link href="/login">
          <Button variant="default" className="text-white">
            Logga in
          </Button>
        </Link>
      </div>
    </header>
  );
}
