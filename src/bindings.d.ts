export {};

declare global { // This is a giant hack
  interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
  }
  // idk why this isn't defined already
  // deno-lint-ignore no-empty-interface
  interface Cache {}
}

declare global { // Variables provided by wrangler
  const CLIENT_PUBLIC_KEY: string;
}
