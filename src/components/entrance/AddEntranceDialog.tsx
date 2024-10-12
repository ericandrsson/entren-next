import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { Camera, MapPin, Upload } from "lucide-react";
import { useState } from "react";

export default function AddEntranceDialog({
  placeName = "Place Name",
  isOpen,
  onClose,
  onSaveAndAddAnother,
}) {
  const [step, setStep] = useState(1);
  const [entranceType, setEntranceType] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [accessibilityDetails, setAccessibilityDetails] = useState("");
  const [hasLocationMetadata, setHasLocationMetadata] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (addAnother = false) => {
    // Here you would typically send the data to your backend
    console.log({ entranceType, photo, location, accessibilityDetails });
    if (addAnother) {
      onSaveAndAddAnother();
      resetForm();
    } else {
      onClose();
    }
  };

  const resetForm = () => {
    setStep(1);
    setEntranceType("");
    setPhoto(null);
    setLocation({ lat: null, lng: null });
    setAccessibilityDetails("");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    // Simulating metadata extraction
    setTimeout(() => {
      const hasMetadata = Math.random() < 0.5; // 50% chance of having metadata
      setHasLocationMetadata(hasMetadata);
      if (hasMetadata) {
        setLocation({ lat: 59.3293, lng: 18.0686 }); // Example coordinates for Stockholm
      }
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lägg till Entré</DialogTitle>
          <DialogDescription>
            Hjälp andra att hitta tillgängliga ingångar genom att lägga till
            entréinformation för {placeName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {step === 1 && (
            <div className="grid gap-2">
              <Label htmlFor="entrance-type">Välj typ av entré</Label>
              <Select onValueChange={setEntranceType}>
                <SelectTrigger id="entrance-type">
                  <SelectValue placeholder="Välj entrétyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Huvudentré</SelectItem>
                  <SelectItem value="side">Sidoentré</SelectItem>
                  <SelectItem value="back">Bakentré</SelectItem>
                  <SelectItem value="ramp">Rampentré</SelectItem>
                  <SelectItem value="other">Annan typ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-2">
              <Label>Lägg till en bild på entrén</Label>
              <div className="flex justify-center items-center h-[200px] bg-muted rounded-md">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Entrance"
                    className="max-h-full rounded-md"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ingen bild uppladdad
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    document.getElementById("photo-upload").click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" /> Ladda upp bild
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" /> Ta foto
                </Button>
              </div>
            </div>
          )}

          {step === 3 && !hasLocationMetadata && (
            <div className="grid gap-2">
              <Label>Markera platsen för entrén</Label>
              <div className="h-[200px] bg-muted flex items-center justify-center rounded-md">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Map Placeholder
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Latitude"
                  value={location.lat || ""}
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      lat: parseFloat(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Longitude"
                  value={location.lng || ""}
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      lng: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}

          {((step === 3 && hasLocationMetadata) || step === 4) && (
            <div className="grid gap-2">
              <Label htmlFor="accessibility-details">
                Tillgänglighetsdetaljer
              </Label>
              <Textarea
                id="accessibility-details"
                placeholder="Beskriv tillgängligheten för denna entré..."
                value={accessibilityDetails}
                onChange={(e) => setAccessibilityDetails(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Tillbaka
            </Button>
          )}
          {step < (hasLocationMetadata ? 3 : 4) ? (
            <Button onClick={handleNext}>Nästa</Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => handleSubmit(false)}>Spara entré</Button>
              <Button variant="outline" onClick={() => handleSubmit(true)}>
                Spara och lägg till en till
              </Button>
            </div>
          )}
        </DialogFooter>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Steg {step} av {hasLocationMetadata ? 3 : 4}
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          Tack för din hjälp med att göra platser mer tillgängliga!
        </div>
      </DialogContent>
    </Dialog>
  );
}
