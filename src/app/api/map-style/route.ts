import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // Validate the token (replace 'your-secret-token' with your actual token or validation logic)
  if (!token || token !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const tileServerUrl = process.env.NEXT_PUBLIC_TILE_SERVER_URL || "http://localhost:3000";

  // Load the style.json template from the server-only directory
  const tilesJsonPath = path.join(process.cwd(), "src", "libs", "map", "style.json");
  const styleJsonContent = await fs.readFile(tilesJsonPath, "utf8");
  const modifiedStyle = JSON.parse(styleJsonContent);

  // Modify the style object
  modifiedStyle.sources.openmaptiles.url = `${baseUrl}/api/map-tiles`;
  modifiedStyle.glyphs = `${tileServerUrl}/font/{fontstack}/{range}`;
  modifiedStyle.sprite = `${tileServerUrl}/sprite/sprites`;

  return NextResponse.json(modifiedStyle);
}
