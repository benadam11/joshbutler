export async function subscribe(email: string, apiKey: string) {
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