import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  AlertTriangle,
  Check,
  Coffee,
  Flag,
  Info,
  MapPin,
  Shield,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Photo = {
  id: string;
  url: string;
  alt: string;
};

type Entrance = {
  id: string;
  name: string;
  accessibility: "full" | "partial" | "none";
  details: string;
  photos: Photo[];
};

type Place = {
  id: string;
  name: string;
  address: string;
  category: string;
  entrances: Entrance[];
  verified: boolean;
};

// Mock data
const mockPlace: Place = {
  id: "1",
  name: "Central Park Cafe",
  address: "123 Park Avenue, New York, NY 10022",
  category: "Coffee Shop",
  entrances: [
    {
      id: "main",
      name: "Main Entrance",
      accessibility: "full",
      details: "Wide doors with automatic opener, no steps.",
      photos: [
        {
          id: "1",
          url: "/placeholder.svg?height=200&width=300",
          alt: "Main entrance view",
        },
      ],
    },
    {
      id: "side",
      name: "Side Entrance",
      accessibility: "partial",
      details: "One small step, narrow door.",
      photos: [
        {
          id: "2",
          url: "/placeholder.svg?height=200&width=300",
          alt: "Side entrance view",
        },
      ],
    },
  ],
  verified: true,
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "coffee shop":
      return <Coffee className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

export default function PlaceDetail({ place = mockPlace }: { place?: Place }) {
  const [expandedEntrance, setExpandedEntrance] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const getAccessibilityIcon = (accessibility: "full" | "partial" | "none") => {
    switch (accessibility) {
      case "full":
        return <Check className="text-green-500" />;
      case "partial":
        return <AlertTriangle className="text-orange-500" />;
      case "none":
        return <X className="text-red-500" />;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-2">
            {getCategoryIcon(place.category)}
            <div>
              <CardTitle className="text-2xl font-bold">{place.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <p className="text-muted-foreground">{place.category}</p>
                <span className="text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">{place.address}</p>
              </div>
            </div>
          </div>
          {place.verified && (
            <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              <Shield className="w-4 h-4 mr-1" />
              <span>Verified</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="space-y-6">
            <section aria-labelledby="entrances-heading">
              <h2 id="entrances-heading" className="text-lg font-semibold mb-2">
                Entrances
              </h2>
              <ul className="space-y-4">
                {place.entrances.map((entrance) => (
                  <li key={entrance.id}>
                    <Collapsible
                      open={expandedEntrance === entrance.id}
                      onOpenChange={() =>
                        setExpandedEntrance(
                          expandedEntrance === entrance.id ? null : entrance.id,
                        )
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span className="flex items-center">
                            {entrance.name}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 ml-2 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{entrance.details}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </span>
                          {getAccessibilityIcon(entrance.accessibility)}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-2">
                        <p className="text-sm mb-2 font-medium">
                          {entrance.details}
                        </p>
                        <div className="grid grid-cols-1 gap-2 mb-2">
                          {entrance.photos.map((photo) => (
                            <Button
                              key={photo.id}
                              variant="ghost"
                              className="p-0 w-full h-auto"
                              onClick={() => setSelectedPhoto(photo)}
                            >
                              <Image
                                src={photo.url}
                                alt={photo.alt}
                                width={300}
                                height={200}
                                className="rounded-md object-cover w-full"
                              />
                            </Button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="actions-heading">
              <h2 id="actions-heading" className="sr-only">
                User Actions
              </h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Flag className="mr-2 h-4 w-4" />
                  Report a Problem
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in Maps
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </CardContent>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.alt}
              width={800}
              height={600}
              className="rounded-md object-contain"
            />
            <p className="mt-2 text-sm text-center">{selectedPhoto.alt}</p>
            <Button
              className="mt-4 w-full"
              onClick={() => setSelectedPhoto(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
