import type { APIRoute } from "astro";
import { md5 } from "hash-wasm";
import { getRuntime } from "@astrojs/cloudflare/runtime";

async function addSubscriber(email: string, listId: string, apiKey: string) {
  const subscriber_hash = await md5(email);
  const res = await fetch(
    `https://us9.api.mailchimp.com/3.0/lists/${listId}/members/${subscriber_hash}?skip_merge_validation=true`,
    {
      method: "PUT",
      headers: {
        Authorization: `anystring:${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        status: "subscribed",
      }),
    }
  );

  if(res.status !== 200) {
    console.log(res);
  }

  return res.status === 200;
}

export const post: APIRoute = async ({ request }) => {
  if (
    request.headers.get("Content-Type") === "application/x-www-form-urlencoded"
  ) {
    const body = await request.formData();
    const email = body.get("email") as string;
    const runtime = getRuntime(request);
    // const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } = runtime.env as any;
    // // Post to Mailchimp
    // const success = await addSubscriber(
    //   email,
    //   MAILCHIMP_API_KEY as string,
    //   MAILCHIMP_LIST_ID as string
    // );

    // if (!success) {
    //   return new Response(null, { status: 400 });
    // }
    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://waterbrookmultnomah.com/wp-content/uploads/2022/10/BeautifulUnion_SP.pdf`,
        // "Set-Cookie": "emailsignupstatus=success",
      },
    });
  }
  return new Response(null, { status: 400 });
};
