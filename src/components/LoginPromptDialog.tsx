import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { X } from "lucide-react";

interface LoginPromptDialogProps {
  appName: string;
  onGoToLoginPage: () => void;
  onClose: () => void;
}

export default function LoginPromptDialog({
  appName,
  onGoToLoginPage,
  onClose,
}: LoginPromptDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-bold text-center">
            Tack för din hjälp, men vi behöver lite mer från dig!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">
            Vi ser att du vill göra skillnad!
          </h2>
          <p>
            Tack för att du vill bidra till att göra {appName} ännu bättre genom
            att lägga till entréinformation. För att säkerställa att alla bidrag
            är pålitliga och korrekta, behöver vi att du loggar in eller skapar
            ett konto först.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Pålitliga Bidrag:</strong> Genom att logga in
                säkerställer vi att alla bidrag kommer från engagerade
                användare, precis som du!
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Få Karma-poäng:</strong> Visste du att du samlar
                karma-poäng för varje entré du lägger till? Logga in och börja
                samla!
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Håll Koll på Dina Bidrag:</strong> Du kan också se och
                uppdatera dina bidrag i framtiden, och få feedback från andra
                användare.
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={onGoToLoginPage}>
            Gå till inloggningssidan
          </Button>
          <Button variant="link" className="w-full" onClick={onClose}>
            Avbryt
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Vi är stolta över våra användares insatser och ditt bidrag kommer
            göra skillnad. Logga in eller skapa ett konto för att hjälpa till
            med att öppna dörrarna för fler!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
