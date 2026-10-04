import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, honeypot } = body;

    // Honeypot check for bots
    if (honeypot) {
      return NextResponse.json({ ok: true, status: "ignored" });
    }

    // Input validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name / Organization is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { ok: false, error: "Transmission message cannot be empty." },
        { status: 400 }
      );
    }

    const endpointId = process.env.FORMSUBMIT_TOKEN || "ahmadmdsajid129@gmail.com";
    const reqOrigin = req.headers.get("origin") || req.headers.get("referer");
    let origin = "http://localhost:3000";
    try {
      if (reqOrigin) {
        origin = new URL(reqOrigin).origin;
      }
    } catch {}

    // Forward to FormSubmit.co
    const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${endpointId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: `${origin}/`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Portfolio-Relay/1.0",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        _replyto: email.trim(),
        message: message.trim(),
        _subject: `[Quant Inquiry] New transmission from ${name.trim()}`,
        _template: "table",
        _captcha: "false",
      }),
    });

    const data = await formSubmitRes.json().catch(() => ({}));
    const isSuccess = data.success === "true" || data.success === true;
    const isActivationNeeded =
      typeof data.message === "string" &&
      data.message.toLowerCase().includes("activation");

    if (isActivationNeeded) {
      return NextResponse.json({
        ok: true,
        status: "activation_required",
        message: "One-time activation email sent to ahmadmdsajid129@gmail.com. Confirm it once to activate.",
        info: data.message,
      });
    }

    if (!isSuccess && formSubmitRes.status >= 400) {
      return NextResponse.json(
        { ok: false, error: data.message || "Relay service error" },
        { status: formSubmitRes.status }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "delivered",
      message: "Transmission delivered successfully.",
      info: data.message || "Message dispatched",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "Transmission relay error. Please try direct email." },
      { status: 500 }
    );
  }
}
