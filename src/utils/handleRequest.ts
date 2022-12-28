export interface Caches {
  default: {
    put(request: Request | string, response: Response): Promise<undefined>;
    match(request: Request | string): Promise<Response | undefined>;
  };
}

declare let caches: Caches;

export default async function handleRequest(
  request: Request,
  ctx: any
): Promise<Response | undefined> {
  let cache = caches.default;
  let response = await cache.match(request);
  if (response) {
    console.log("CACHE HIT");
    return response;
  }

  try {
    const res = await fetch(request);
    response = new Response(res.body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "referer, origin, content-type",
        "Access-Control-Max-Age": "86400",
        "Cache-Control": `s-maxage=${60 * 60 * 24}, stale-while-revalidate=${
          60 * 60 * 24
        }`,
      },
    });

    response.headers.delete("pragma");
    ctx.waitUntil(cache.put(request, response.clone()));
    return response;
  } catch (e) {
    console.log(e);
  }
}
