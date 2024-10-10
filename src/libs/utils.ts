import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function requestUserLocation(): Promise<[number, number] | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      resolve(null);
      return;
    }

    function success(position: GeolocationPosition) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      resolve([longitude, latitude]);
    }

    function error() {
      console.error("Unable to retrieve your location");
      resolve(null);
    }

    navigator.geolocation.getCurrentPosition(success, error);
  });
}
