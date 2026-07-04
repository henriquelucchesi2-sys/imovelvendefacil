import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get("url");
  if (!imageUrl) {
    return new NextResponse("Missing 'url' parameter", { status: 400 });
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  const blob = await response.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
