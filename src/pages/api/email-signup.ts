import type { APIRoute } from "astro";
import { md5 } from "hash-wasm";
import { getRuntime } from "@astrojs/cloudflare/runtime";

const MAILCHIMP_API_KEY = "93428a414d8b8e65420ebd83719ca4ab-us9";

async function subscribe(email: string) {
  const subscriberHash = await md5(email);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `apikey ${MAILCHIMP_API_KEY}`);
  const res = await fetch(
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
    await subscribe(email);
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
