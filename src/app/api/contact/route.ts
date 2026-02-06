import nodemailer from "nodemailer";

const { CONTACT_SMTP_HOST, CONTACT_SMTP_PORT, CONTACT_SMTP_USER, CONTACT_SMTP_PASS, CONTACT_FROM } = process.env;

const CONTACT_TO = process.env.CONTACT_TO ?? "clara.forwood@gmail.com";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request) {
  if (!CONTACT_SMTP_HOST || !CONTACT_SMTP_PORT || !CONTACT_SMTP_USER || !CONTACT_SMTP_PASS || !CONTACT_FROM) {
    return jsonResponse(
      {
        error:
          "Email service is not configured. Please set CONTACT_SMTP_HOST, CONTACT_SMTP_PORT, CONTACT_SMTP_USER, CONTACT_SMTP_PASS, and CONTACT_FROM.",
      },
      500,
    );
  }

  let email = "";
  let message = "";

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { email?: string; message?: string };
      email = body.email?.trim() ?? "";
      message = body.message?.trim() ?? "";
    } else {
      const formData = await request.formData();
      email = String(formData.get("email") ?? "").trim();
      message = String(formData.get("message") ?? "").trim();
    }
  } catch {
    return jsonResponse({ error: "Invalid request payload." }, 400);
  }

  if (!email || !message) {
    return jsonResponse({ error: "Email and message are required." }, 400);
  }

  const port = Number(CONTACT_SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: CONTACT_SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: CONTACT_SMTP_USER,
      pass: CONTACT_SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `New message from ${email}`,
      text: message,
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Contact form email failed", error);
    return jsonResponse({ error: "Unable to send message right now." }, 500);
  }
}
