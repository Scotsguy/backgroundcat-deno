import "./bindings.d.ts";

import "workers-types";
import {
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
} from "discord-interactions";

import { verifyDiscordSignature } from "./discord.ts";

// deno-lint-ignore no-explicit-any
function respondWithJson(obj: any): Response {
  return new Response(JSON.stringify(obj), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function handleInteraction(request: Request): Promise<Response> {
  const bodyText = new TextDecoder("utf-8").decode(await request.arrayBuffer());

  if (!verifyDiscordSignature(request, bodyText)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const body = JSON.parse(bodyText); // I sure hope discord never sends malformed json

  if (body.type == InteractionType.PING) {
    return respondWithJson({
      type: InteractionResponseType.PONG,
    });
  }

  if (body.type != InteractionType.APPLICATION_COMMAND) {
    console.log("Invalid type");
    return new Response("Invalid interaction type", { status: 501 }); // don't care
  }

  return respondWithJson({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "This is an ephemeral response",
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  });
}

async function handleRequest(request: Request) {
  const url = new URL(request.url);

  if (request.method === "POST" && url.pathname === "/interactions") {
    return await handleInteraction(request);
  }
  return new Response("Invalid path", { status: 404 });
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
