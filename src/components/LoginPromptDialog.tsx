"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useRouter } from "next/navigation";

interface LoginPromptDialogProps {
  appName: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function LoginPromptDialog({
  appName,
  onClose,
  isOpen,
}: LoginPromptDialogProps) {
  const router = useRouter();

  function handleGoToLoginPage() {
    router.push("/login");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Logga in för att bidra! 🙏
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Vi ser att du vill göra skillnad! 🌟
          </h2>
          <p>
            Tack för att du vill bidra till att göra {appName} ännu bättre genom
            att lägga till entréinformation. För att säkerställa att alla bidrag
            är pålitliga och korrekta, behöver vi att du loggar in eller skapar
            ett konto först.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>
                <strong>Pålitliga Bidrag:</strong> Genom att logga in
                säkerställer vi att alla bidrag kommer från engagerade
                användare, precis som du!
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⭐</span>
              <span>
                <strong>Få Karma-poäng:</strong> Visste du att du samlar
                karma-poäng för varje entré du lägger till? Logga in och börja
                samla!
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📊</span>
              <span>
                <strong>Håll Koll på Dina Bidrag:</strong> Du kan också se och
                uppdatera dina bidrag i framtiden, och få feedback från andra
                användare.
              </span>
            </li>
          </ul>
        </div>
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-end">
          <Button className="w-full sm:w-auto" onClick={handleGoToLoginPage}>
            Gå till inloggningssidan
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Avbryt
          </Button>
        </DialogFooter>
        <p className="text-sm text-center text-muted-foreground mt-4">
          Vi är stolta över våra användares insatser och ditt bidrag kommer göra
          skillnad. Logga in eller skapa ett konto för att hjälpa till med att
          öppna dörrarna för fler! 🚪🔓
        </p>
      </DialogContent>
    </Dialog>
  );
}
