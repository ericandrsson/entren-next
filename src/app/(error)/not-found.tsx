import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center p-4 text-center text-foreground sm:mt-24">
      <h1 className="mb-4 text-4xl font-bold">🏚️ 404 🗺️</h1>
      <p className="mb-6 text-2xl font-semibold">Den här vägen leder ingenstans!</p>
      <p className="mb-8 text-lg">Oops! Det ser ut som du har hamnat på en plats som inte finns på vår karta.</p>
      <div className="mb-12 flex w-full flex-col gap-4 sm:w-auto">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">Gå tillbaka till startsidan</Link>
        </Button>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Psst! 🤫</p>
        <p className="text-sm">Lägg till en ny entré och gör världen lite mer tillgänglig.</p>
      </div>
    </div>
  );
}
