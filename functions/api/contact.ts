import type { EventContext } from "@cloudflare/workers-types";

export async function onRequest(context: EventContext<any, any, any>) {
  const request = context.request;
  if(request.method === "POST") {
    const data = await request.formData();
    const email = data.get("email");
    const message = data.get("message");
    console.log(email, message);
    return Response.redirect("https://joshbutler.pages.dev/speaking", 302);
  }
  return Response.redirect("https://joshbutler.pages.dev/speaking", 404);
}
