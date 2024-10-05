import PocketBase from "pocketbase";

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || "");
if (process.env.NODE_ENV === "development") pb.autoCancellation(false);
