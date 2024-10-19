import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-foreground p-4 text-center mt-16 sm:mt-24">
      <h1 className="text-4xl font-bold mb-4">🏚️ 404 🗺️</h1>
      <p className="text-2xl font-semibold mb-6">
        Den här vägen leder ingenstans!
      </p>
      <p className="text-lg mb-8">
        Oops! Det ser ut som du har hamnat på en plats som inte finns på vår
        karta.
      </p>
      <div className="flex flex-col gap-4 mb-12 w-full sm:w-auto">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">Gå tillbaka till startsidan</Link>
        </Button>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Psst! 🤫</p>
        <p className="text-sm">
          Lägg till en ny entré och gör världen lite mer tillgänglig.
        </p>
      </div>
    </div>
  );
}
