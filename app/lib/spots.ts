import { pb } from "@/lib/db";

export const getImageUrl = (imageFilename: string, spotId: string) => {
  if (!imageFilename) return null;
  return `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/spots/${spotId}/${imageFilename}`;
};
