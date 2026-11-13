export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface Email {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

interface SignableRequest {
  method: string;
  url: URL;
  headers: Record<string, string>;
  body: string;
  service: string;
}

const encoder = new TextEncoder();

const toHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

const sha256 = async (value: string) =>
  toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));

const hmac = async (key: BufferSource, value: string) =>
  crypto.subtle.sign(
    "HMAC",
    await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    ),
    encoder.encode(value),
  );

// AWS Signature Version 4. It returns the headers to send, with Authorization added.
export const signRequest = async (
  request: SignableRequest,
  credentials: AwsCredentials,
  now = new Date(),
): Promise<Record<string, string>> => {
  const timestamp = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = timestamp.slice(0, 8);
  const headers: Record<string, string> = {
    ...request.headers,
    host: request.url.host,
    "x-amz-date": timestamp,
  };

  const names = Object.keys(headers)
    .map((name) => name.toLowerCase())
    .sort();
  const lowerCased = Object.fromEntries(
    Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value]),
  );
  const canonicalHeaders = names
    .map((name) => `${name}:${(lowerCased[name] ?? "").trim()}\n`)
    .join("");
  const signedHeaders = names.join(";");

  const canonicalRequest = [
    request.method,
    request.url.pathname,
    request.url.searchParams.toString(),
    canonicalHeaders,
    signedHeaders,
    await sha256(request.body),
  ].join("\n");

  const scope = `${date}/${credentials.region}/${request.service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    timestamp,
    scope,
    await sha256(canonicalRequest),
  ].join("\n");

  let key = await hmac(
    encoder.encode(`AWS4${credentials.secretAccessKey}`),
    date,
  );
  for (const part of [credentials.region, request.service, "aws4_request"]) {
    key = await hmac(key, part);
  }
  const signature = toHex(await hmac(key, stringToSign));

  return {
    ...headers,
    Authorization: `AWS4-HMAC-SHA256 Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
};

// Sends one plain text email through the Amazon SES v2 API.
export const sendEmail = async (
  email: Email,
  credentials: AwsCredentials,
): Promise<Response> => {
  const url = new URL(
    `https://email.${credentials.region}.amazonaws.com/v2/email/outbound-emails`,
  );
  const body = JSON.stringify({
    FromEmailAddress: email.from,
    Destination: { ToAddresses: [email.to] },
    ReplyToAddresses: [email.replyTo],
    Content: {
      Simple: {
        Subject: { Data: email.subject, Charset: "UTF-8" },
        Body: { Text: { Data: email.text, Charset: "UTF-8" } },
      },
    },
  });
  const headers = await signRequest(
    {
      method: "POST",
      url,
      headers: { "content-type": "application/json" },
      body,
      service: "ses",
    },
    credentials,
  );
  // fetch sets the Host header itself.
  delete headers["host"];

  return fetch(url, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(10_000),
  });
};
