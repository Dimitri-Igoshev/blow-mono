import { NextRequest, NextResponse } from "next/server";

import { config } from "@/common/env";

export async function POST(req: NextRequest) {
  const { code, redirect_uri } = await req.json();

  if (typeof code !== "string" || typeof redirect_uri !== "string") {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }

  const body = new URLSearchParams();

  body.set("code", code);
  body.set("grant_type", "authorization_code");
  body.set("redirect_uri", redirect_uri);

  if (config.NEXT_PUBLIC_YOOMONEY_CLIENT_ID) {
    body.set("client_id", config.NEXT_PUBLIC_YOOMONEY_CLIENT_ID);
  }

  if (config.NEXT_YOOMONEY_CLIENT_SECRET) {
    body.set("client_secret", config.NEXT_YOOMONEY_CLIENT_SECRET);
  }

  const res = await fetch("https://yoomoney.ru/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.ok ? 200 : 400 });
}
