import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const tileServerUrl =
    process.env.NEXT_PUBLIC_TILE_SERVER_URL || "http://localhost:3000";

  // Load the tiles.json template from the server-only directory
  const tilesJsonPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "map",
    "tiles.json",
  );
  const tilesJsonContent = await fs.readFile(tilesJsonPath, "utf8");
  const tilesJson = JSON.parse(tilesJsonContent);

  // Modify the tiles URL dynamically
  tilesJson.tiles = [
    process.env.NEXT_PUBLIC_TILE_URL || `${tileServerUrl}/sweden/{z}/{x}/{y}`,
  ];

  return NextResponse.json(tilesJson);
}
