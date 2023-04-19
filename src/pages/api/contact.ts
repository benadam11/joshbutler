import { getRuntime } from "@astrojs/cloudflare/runtime";
import type { APIRoute } from "astro";
import { sendEmail } from "../../utils/sendEmail";

function formatEmail({ email, message, ...rest }: any) {
  // format ...rest into a table of keys and values
  const table = Object.entries(rest)
    .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
    .join("");
    
  return `
  <html>
    <head>
      <title>Message from ${email}</title>
      <meta charset="utf-8" />
      <style>
        h1 {
          font-size: 1rem;
        }
        table {
          border-collapse: collapse;
        }
        td, th {
          border: 1px solid black;
          padding: 5px;
        }
      </style>
    </head>
    <body>
      <h1>Message from ${email}</h1>
      <p>${message}</p>
      <table>
        ${table}
      </table>
    </body>
  </html>
  `;
}

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    try {
      const body = (await request.json()) as any;
      const { email, message, ...rest } = body;
      const cf = getRuntime<{ SENDGRID_API_KEY: string }, {}>(request);
      const api_key = cf?.env?.SENDGRID_API_KEY || (import.meta.env.SENDGRID_API_KEY as string);
      if(!api_key) throw new Error('No API Key found');
      const html = formatEmail({ email, message, ...rest });
      await sendEmail({ email, message, html, api_key });
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
