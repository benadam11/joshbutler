export async function sendEmail({
  email,
  message,
  html,
  api_key,
}: {
  email: string;
  message: string;
  html?: string;
  api_key: string;
}) {
  // send email via sendgrid rest api

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: "joshua.butler@gmail.com",
            },
          ],
          subject: "New Contact Form Submission",
        },
      ],
      from: {
        email: "joshua.butler@gmail.com",
      },
      content: [
        {
          type: "text/plain",
          value: message,
        },
        {
          type: "text/html",
          value: html,
        },

      ],
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to send email");
  }
}
