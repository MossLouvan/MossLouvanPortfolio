import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  // Option 1: return the image URL
  return NextResponse.json({ url: "/profile/avatar.jpg" });
}