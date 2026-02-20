import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'achievements');
  let files: string[] = [];
  try {
    files = await fs.promises.readdir(dir);
  } catch (e) {
    // directory might not exist or be empty
    files = [];
  }
  const images = files
    .filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
    .map((f) => `/achievements/${f}`);

  return NextResponse.json({ images });
}
