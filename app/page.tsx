"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  MapPin,
  List,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import dynamic from "next/dynamic";
import { Header } from "./_components/Header";

const MapWithNoSSR = dynamic(() => import("./(map)/Map/Map"), {
  loading: () => <div>Loading....</div>,
  ssr: false,
});

export default function Page() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<"list" | "map" | "both">("both");
  const [isMobile, setIsMobile] = useState(false);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
      setView(isMobile ? "list" : "both");
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const categories = [
    "Healthcare",
    "Education",
    "Recreation",
    "Public Service",
    "Hospitality",
  ];

  const toggleListCollapse = () => {
    setIsListCollapsed(!isListCollapsed);
    setShouldUpdateMap(true);
  };

  useEffect(() => {
    if (shouldUpdateMap) {
      const timer = setTimeout(() => {
        setShouldUpdateMap(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [shouldUpdateMap]);

  const ListContent = () => (
    <div className="space-y-4">
      {[
        {
          name: "Fysioterapeut Fosietorp",
          address: "Ormvråksgatan 15, 215 62 Malmö",
          category: "Healthcare",
        },
        {
          name: "Distriktssköterska Fosietorp",
          address: "Ormvråksgatan 15, 215 62 Malmö",
          category: "Healthcare",
        },
        {
          name: "Barnavårdscentral Fosietorp",
          address: "Ormvråksgatan 15, 215 62 Malmö",
          category: "Healthcare",
        },
        {
          name: "Närhälsan Södra torget rehabmottagning",
          address: "Kvarngatan 4, 503 36 Borås",
          category: "Healthcare",
        },
        {
          name: "Hunnebostrand Hav och Land",
          address: "Parkgatan 1, 456 61 Hunnebostrand",
          category: "Recreation",
        },
        {
          name: "Bollstanässkolan",
          address: "Stora vägen 80, 194 68 Upplands Väsby",
          category: "Education",
        },
        {
          name: "Frestaskolan",
          address: "Älvhagsvägen 15, 194 53 Upplands Väsby",
          category: "Education",
        },
        {
          name: "Grimstaskolan",
          address: "Väpnaren 1, 194 64 Upplands Väsby",
          category: "Education",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex bg-white shadow rounded-lg overflow-hidden"
        >
          <img
            src={`/placeholder.svg?height=100&width=100&text=${index + 1}`}
            alt={item.name}
            className="w-24 h-24 object-cover"
          />
          <div className="p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.address}</p>
            </div>
            <Badge variant="secondary" className="self-start mt-2">
              {item.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-20px)]">
      <Header />
      {/* Search and Filter Bar */}
      <div className="bg-white shadow-md p-4 flex items-center space-x-2">
        <Input placeholder="Search..." className="flex-grow" />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="cursor-pointer"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden flex relative">
        {/* List View */}
        <div
          className={`h-full overflow-y-auto transition-all duration-300 ease-in-out
            ${
              isMobile
                ? view === "map"
                  ? "hidden"
                  : "w-full"
                : isListCollapsed
                ? "w-0"
                : "w-1/3"
            } 
            ${!isMobile && "border-r"}`}
        >
          <div className="p-4">
            <ListContent />
          </div>
        </div>

        {/* Map View */}
        <div
          className={`h-full transition-all duration-300 ease-in-out
            ${
              isMobile
                ? view === "list"
                  ? "hidden"
                  : "w-full"
                : isListCollapsed
                ? "w-full"
                : "w-2/3"
            }`}
        >
          <div className="p-4 h-full relative">
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 z-0">
                <MapWithNoSSR shouldUpdate={shouldUpdateMap} />
              </div>
            </div>
            {!isMobile && (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-8 left-8 z-10"
                onClick={toggleListCollapse}
              >
                {isListCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Floating View Toggle Button (Mobile Only) */}
        {isMobile && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              variant="default"
              size="lg"
              className="text-white rounded-full shadow-lg"
              onClick={() => setView(view === "list" ? "map" : "list")}
            >
              {view === "list" ? (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </>
              ) : (
                <>
                  <List className="h-4 w-4 mr-2" />
                  View List
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
