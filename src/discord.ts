// deno-lint-ignore-file no-undef

import "./bindings.d.ts";

import { verifyKey } from "discord-interactions";

export function verifyDiscordSignature(request: Request, bodyBuffer: string) {
  const timestamp = request.headers.get("X-Signature-Timestamp") || "";
  const signature = request.headers.get("X-Signature-Ed25519") || "";

  let res = false;
  try {
    res = verifyKey(bodyBuffer, signature, timestamp, CLIENT_PUBLIC_KEY);
  } catch (_) {
    // Do nothing, res is false
  }
  return res;
}
