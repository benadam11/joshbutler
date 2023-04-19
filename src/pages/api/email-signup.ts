import type { APIRoute } from "astro";
import { getRuntime } from "@astrojs/cloudflare/runtime";
import { subscribe } from "../../utils/subscribe";

export const post: APIRoute = async ({ request }) => {
  if (
    request.headers.get("Content-Type") === "application/x-www-form-urlencoded"
  ) {
    const data = await request.formData();
    const email = data.get("email") as string;
    const cf = getRuntime<{ MAILCHIMP_API_KEY: string }, {}>(request);
    const apiKey = cf.env.MAILCHIMP_API_KEY;
    await subscribe(email, apiKey);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://waterbrookmultnomah.com/wp-content/uploads/2022/10/BeautifulUnion_SP.pdf`,
        "Set-Cookie": "emailsignupstatus=success",
      },
    });
  }
  return new Response(null, { status: 400 });
};
