import { NextResponse } from "next/server";
import { images } from "./images";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ images });
}