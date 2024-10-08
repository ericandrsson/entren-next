import { NextResponse } from 'next/server';

import tiles from '@/public/map/style/tiles.json';
import mapStyle from '@/public/map/style/style.json';

export async function GET() {
  const modifiedTiles = JSON.parse(JSON.stringify(tiles));
  const modifiedStyle = JSON.parse(JSON.stringify(mapStyle));

  // Replace placeholders with environment variables
  modifiedTiles.tiles = [process.env.NEXT_PUBLIC_BASE_TILES_URL || ''];
  console.log(modifiedTiles.tiles);
  modifiedStyle.sources.openmaptiles.url = modifiedTiles.url;
  modifiedStyle.glyphs = process.env.NEXT_PUBLIC_GLYPHS_URL || '';
  modifiedStyle.sprite = process.env.NEXT_PUBLIC_SPRITE_URL || '';

  return NextResponse.json(modifiedStyle);
}