import { NextResponse } from "next/server";
import { images } from "./images";

export async function GET() {
  return NextResponse.json({ images });
}
