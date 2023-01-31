import type { APIRoute } from "astro";
import { getRuntime } from "@astrojs/cloudflare/runtime";

async function subscribe(email: string, apiKey: string) {
  const subscriberHash = await crypto.subtle.digest(
    "md5",
    new TextEncoder().encode(email.toLowerCase())
  );

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${apiKey}`);
  await fetch(
    `https://us9.api.mailchimp.com/3.0/lists/0a3dcfa066/members/${subscriberHash}?skip_merge_validation=true`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    }
  );
}

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
