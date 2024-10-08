import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function Header() {

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
