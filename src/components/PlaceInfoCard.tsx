import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Circle,
  ExternalLink,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

// Mock Data
const mockPlace = {
  name: "Central Park",
  category: "Park",
  type: "Public Park",
  mainEntrance: "East Entrance",
  entrances: [
    {
      id: 1,
      name: "East Entrance",
      accessibility: "fully",
      photos: ["/images/entrance1a.jpg", "/images/entrance1b.jpg"],
      details: {
        ramp: true,
        doorWidth: "36 inches",
        automaticDoors: true,
      },
    },
    {
      id: 2,
      name: "West Entrance",
      accessibility: "partial",
      photos: ["/images/entrance2a.jpg"],
      details: {
        ramp: false,
        doorWidth: "32 inches",
        automaticDoors: false,
      },
    },
    {
      id: 3,
      name: "North Entrance",
      accessibility: "none",
      photos: [],
      details: {
        ramp: false,
        doorWidth: "28 inches",
        automaticDoors: false,
      },
    },
  ],
};

type AccessibilityStatus = "fully" | "partial" | "none";

const getAccessibilityIcon = (status: AccessibilityStatus) => {
  switch (status) {
    case "fully":
      return <CheckCircle className="text-green-500 w-5 h-5 mr-2" />;
    case "partial":
      return <Circle className="text-orange-500 w-5 h-5 mr-2" />;
    case "none":
      return <XCircle className="text-red-500 w-5 h-5 mr-2" />;
    default:
      return null;
  }
};

const PlaceInfoCard: React.FC = () => {
  const [selectedAccessibility, setSelectedAccessibility] =
    useState<AccessibilityStatus | null>(null);

  const handleAccessibilitySelect = (status: AccessibilityStatus) => {
    setSelectedAccessibility(status);
    // Handle the accessibility verification logic here
    console.log(`Accessibility set to: ${status}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
      {/* Top Section: Place Information */}
      <div>
        <h2 className="text-2xl font-bold">{mockPlace.name}</h2>
        <p className="text-gray-600">{`${mockPlace.category} - ${mockPlace.type}`}</p>
        <p className="mt-2">
          <strong>Main Entrance:</strong> {mockPlace.mainEntrance}
        </p>
      </div>

      {/* Middle Section: Accessibility Information */}
      <div>
        <h3 className="text-xl font-semibold mb-2">
          Accessibility Information
        </h3>
        {/* Entrances List */}
        <ul className="space-y-2">
          {mockPlace.entrances.map((entrance) => (
            <li key={entrance.id} className="flex items-center">
              {getAccessibilityIcon(entrance.accessibility)}
              <span>{entrance.name}</span>
            </li>
          ))}
        </ul>

        {/* Quick Accessibility Question */}
        <div className="mt-4">
          <p className="font-medium">How accessible is this place?</p>
          <div className="flex space-x-4 mt-2">
            <Button
              variant={
                selectedAccessibility === "fully" ? "default" : "outline"
              }
              onClick={() => handleAccessibilitySelect("fully")}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Helt</span>
            </Button>
            <Button
              variant={
                selectedAccessibility === "partial" ? "default" : "outline"
              }
              onClick={() => handleAccessibilitySelect("partial")}
              className="flex items-center space-x-2"
            >
              <Circle className="w-4 h-4" />
              <span>Delvis</span>
            </Button>
            <Button
              variant={selectedAccessibility === "none" ? "default" : "outline"}
              onClick={() => handleAccessibilitySelect("none")}
              className="flex items-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Inte alls</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Photos and Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Photos of Entrances</h3>
        {/* Photo Gallery */}
        <div className="grid grid-cols-3 gap-2">
          {mockPlace.entrances.flatMap((entrance) =>
            entrance.photos.length > 0
              ? entrance.photos.map((photo, index) => (
                  <Image
                    key={`${entrance.id}-${index}`}
                    src={photo}
                    alt={`${entrance.name} Photo ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded-md cursor-pointer"
                    onClick={() => {
                      // Handle photo click to expand
                      console.log(`Clicked on photo: ${photo}`);
                    }}
                  />
                ))
              : null,
          )}
        </div>
        {/* Add Photo Button */}
        <Button
          variant="primary"
          className="mt-4 flex items-center space-x-2"
          onClick={() => {
            // Handle add photo action
            console.log("Add Photo Clicked");
          }}
        >
          <Camera className="w-4 h-4" />
          <span>Lägg till bilder</span>
        </Button>

        {/* Additional Actions */}
        <div className="mt-6 space-y-2">
          <Button
            variant="destructive"
            className="w-full flex items-center space-x-2"
            onClick={() => {
              // Handle report a problem
              console.log("Report a Problem Clicked");
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Rapportera ett problem</span>
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center space-x-2"
            onClick={() => {
              // Handle opening external map apps
              window.open(
                `https://www.openstreetmap.org/search?query=${mockPlace.name}`,
                "_blank",
              );
            }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Öppna i karta</span>
          </Button>
          <Button
            variant="secondary"
            className="w-full flex items-center space-x-2"
            onClick={() => {
              // Handle improve karma
              console.log("Improve Your Karma Clicked");
            }}
          >
            <span>Förbättra din karma!</span>
          </Button>
        </div>
      </div>

      {/* Entrances Details */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Entrances Details</h3>
        <Accordion type="multiple">
          {mockPlace.entrances.map((entrance) => (
            <AccordionItem key={entrance.id} value={`entrance-${entrance.id}`}>
              <AccordionTrigger>{entrance.name}</AccordionTrigger>
              <AccordionContent>
                <p>
                  <strong>Ramp Availability:</strong>{" "}
                  {entrance.details.ramp ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Door Width:</strong> {entrance.details.doorWidth}
                </p>
                <p>
                  <strong>Automatic Doors:</strong>{" "}
                  {entrance.details.automaticDoors ? "Yes" : "No"}
                </p>
                {/* Allow users to rate the accessibility features */}
                <div className="mt-4">
                  <p className="font-medium">Rate Accessibility:</p>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant={
                        selectedAccessibility === "fully"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleAccessibilitySelect("fully")}
                    >
                      Helt
                    </Button>
                    <Button
                      variant={
                        selectedAccessibility === "partial"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleAccessibilitySelect("partial")}
                    >
                      Delvis
                    </Button>
                    <Button
                      variant={
                        selectedAccessibility === "none" ? "default" : "outline"
                      }
                      onClick={() => handleAccessibilitySelect("none")}
                    >
                      Inte alls
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PlaceInfoCard;
