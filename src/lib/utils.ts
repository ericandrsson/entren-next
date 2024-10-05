import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSpotImageUrl = (imageFilename: string, spotId: string) => {
  if (!imageFilename) return null;
  return `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/spots/${spotId}/${imageFilename}`;
};
