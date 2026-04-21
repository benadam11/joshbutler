import type { APIRoute } from "astro";
import { subscribe } from "../../utils/subscribe";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    try {
      const body = await request.json() as any;
      const email = body.email;
      await subscribe(email);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: { message: e.message } }), {
        status: 400,
      });
    }
  }
  return new Response(null, { status: 400 });
};
