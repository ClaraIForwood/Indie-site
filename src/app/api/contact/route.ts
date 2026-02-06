import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_TO = process.env.CONTACT_TO?.trim() || "clara.forwood@gmail.com";
const CONTACT_FROM = process.env.CONTACT_FROM?.trim() || "Contact Form <onboarding@resend.dev>";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured. Please set RESEND_API_KEY." },
      { status: 500 },
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
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!email || !message) {
    return NextResponse.json({ error: "Email and message are required." }, { status: 400 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      subject: "New Contact Form Submission",
      text: `From: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    if (error) {
      console.error("Contact form email failed", error);
      return NextResponse.json(
        { error: error.message ?? "Unable to send message right now." },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Contact form email failed", error);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 });
  }
}
