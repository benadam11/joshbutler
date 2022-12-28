import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  if (
    request.headers.get("Content-Type") === "application/x-www-form-urlencoded"
  ) {
    const body = await request.formData();
    const email = body.get("email") as string;
    console.log(email);
    // Post to Mailchimp
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
