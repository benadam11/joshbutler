export async function subscribe(email: string) {
  const response = await fetch(
    "https://joshuabutlerpdx.substack.com/api/v1/free",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        captcha_response: "",
        first_url: "",
        referrer: "",
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Substack subscription failed: ${response.status} ${text}`);
  }
}