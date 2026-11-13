import type { APIRoute } from "astro";
import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  RESEND_API_KEY,
} from "astro:env/server";

// The only route the server renders. Every other page is static.
export const prerender = false;

const MIN_SECONDS_BEFORE_SUBMIT = 3;
const MAX_TOKEN_AGE_SECONDS = 24 * 60 * 60;
const MAX_BODY_LENGTH = 20_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

type Field = "name" | "email" | "message";

interface MailSettings {
  apiKey: string;
  from: string;
  to: string;
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

const notConfigured = () =>
  json(503, {
    ok: false,
    code: "not_configured",
    message: "The contact form cannot send messages right now.",
  });

const mailSettings = (): MailSettings | undefined => {
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL) {
    return undefined;
  }
  return {
    apiKey: RESEND_API_KEY,
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
  };
};

const nowInSeconds = () => Math.floor(Date.now() / 1000);

const toHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

const fromHex = (hex: string) =>
  /^([0-9a-f]{2})+$/.test(hex)
    ? Uint8Array.from(hex.match(/../g) ?? [], (pair) => parseInt(pair, 16))
    : undefined;

const signingKey = (apiKey: string) =>
  crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(apiKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const signedText = (issuedAt: number) =>
  new TextEncoder().encode(`contact-form:${issuedAt}`);

// The token records when the page loaded. The signature stops a sender changing the time.
const createToken = async (apiKey: string) => {
  const issuedAt = nowInSeconds();
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(apiKey),
    signedText(issuedAt),
  );
  return `${issuedAt}.${toHex(signature)}`;
};

const tokenAgeInSeconds = async (token: unknown, apiKey: string) => {
  if (typeof token !== "string") return undefined;
  const [issuedAtText = "", signatureHex = ""] = token.split(".");
  const issuedAt = Number(issuedAtText);
  const signature = fromHex(signatureHex);
  if (!Number.isSafeInteger(issuedAt) || !signature) return undefined;

  const valid = await crypto.subtle.verify(
    "HMAC",
    await signingKey(apiKey),
    signature,
    signedText(issuedAt),
  );
  return valid ? nowInSeconds() - issuedAt : undefined;
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export const GET: APIRoute = async () => {
  const settings = mailSettings();
  if (!settings) return notConfigured();
  return json(200, { ok: true, token: await createToken(settings.apiKey) });
};

export const POST: APIRoute = async ({ request }) => {
  const settings = mailSettings();
  if (!settings) return notConfigured();

  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > MAX_BODY_LENGTH) throw new Error("The body is too long");
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("The body is not an object");
    }
    data = parsed as Record<string, unknown>;
  } catch {
    return json(400, {
      ok: false,
      code: "bad_request",
      message: "The form data was not valid. Reload the page and try again.",
    });
  }

  // Only a bot fills in the hidden field. It gets a success reply, but no email goes out.
  if (text(data["website"]) !== "") return json(200, { ok: true });

  const name = text(data["name"]).replace(/\s+/g, " ");
  const email = text(data["email"]);
  const message = text(data["message"]);

  const errors: Partial<Record<Field, string>> = {};
  if (name === "") {
    errors.name = "Enter your name.";
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Your name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }
  if (email === "") {
    errors.email = "Enter your email address.";
  } else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter an email address in the format name@example.com.";
  }
  if (message === "") {
    errors.message = "Enter a message.";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Your message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }
  if (Object.keys(errors).length > 0) {
    return json(400, {
      ok: false,
      code: "invalid",
      message: "Check the form and try again.",
      errors,
    });
  }

  const age = await tokenAgeInSeconds(data["token"], settings.apiKey);
  if (age === undefined || age < 0 || age > MAX_TOKEN_AGE_SECONDS) {
    return json(400, {
      ok: false,
      code: "expired",
      message: "The form expired. Select Send message again.",
      token: await createToken(settings.apiKey),
    });
  }
  if (age < MIN_SECONDS_BEFORE_SUBMIT) {
    return json(429, {
      ok: false,
      code: "too_fast",
      message: "That was too quick. Wait a few seconds, then send again.",
    });
  }

  let sent = false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: settings.from,
        to: [settings.to],
        reply_to: email,
        subject: `Contact form: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    sent = response.ok;
    if (!sent) {
      console.error(
        `Resend rejected the contact email: ${response.status} ${await response.text()}`,
      );
    }
  } catch (error) {
    console.error("The request to Resend failed", error);
  }

  if (!sent) {
    return json(502, {
      ok: false,
      code: "send_failed",
      message: "Your message was not sent. Try again later.",
    });
  }
  return json(200, { ok: true });
};
