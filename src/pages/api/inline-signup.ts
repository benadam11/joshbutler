import { getRuntime } from "@astrojs/cloudflare/runtime";
import type { APIRoute } from "astro";
import { subscribe } from "../../utils/subscribe";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    try {
      const body = await request.json() as any;
      const email = body.email;
      const cf = getRuntime<{ MAILCHIMP_API_KEY: string }, {}>(request);
      const apiKey = cf?.env?.MAILCHIMP_API_KEY || import.meta.env.MAILCHIMP_API_KEY;
      if(!apiKey) throw new Error('No API Key found');
      await subscribe(email, apiKey);
      return new Response(JSON.stringify({ sucess: true }), {
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
