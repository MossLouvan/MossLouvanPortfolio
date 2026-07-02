import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ url: "/profile/avatar.png" });
}
